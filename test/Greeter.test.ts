import { expect } from "chai";
import {deployments, ethers, getNamedAccounts} from "hardhat";
import {MockToken, Payment} from "../typechain";
import {constants} from "ethers";
import {setupUser} from "./utils";

const {time} = require('@openzeppelin/test-helpers');

const THIRTY_DAYS = 86400 * 30;
const SIXTY_DAYS = 86400 * 60;
// const THIRTY_DAYS = time.duration.days(30);
// const SIXTY_DAYS = time.duration.days(60) as number;

const tokenCreatePlanAmount_100 = 100;
const tokenCreatePlanAmount_200 = 200;
const tokenTransferAmount = 1000;

const setup = deployments.createFixture(async () => {
  await deployments.fixture();
  const contracts = {
    token: await ethers.getContract<MockToken>('MockToken'),
    payment: await ethers.getContract<Payment>('Payment')
  };

  const {owner, user1,user2} = await getNamedAccounts();
  const [admin,merchant, subscriber] = [owner, user1, user2];

  return {...contracts,
    admin: await setupUser(admin, contracts),
    merchant: await setupUser(merchant, contracts),
    subscriber: await setupUser(subscriber, contracts)
  };
});

describe("Payment", async () => {
  const {owner, user1,user2} = await getNamedAccounts();
  const [admin,merchant, subscriber] = [owner, user1, user2];
  let payment: Payment;
  let token : MockToken;
  beforeEach(async () => {
    payment = await ethers.getContract('Payment') as Payment;
    token = await ethers.getContract('MockToken') as MockToken;
    await token.transfer(subscriber,tokenTransferAmount);
    await token
        .connect(await ethers.getSigner(subscriber))
        .approve(payment.address,tokenTransferAmount);
  });

  it ('test001', async() => {
    expect(payment.address).not.eq(constants.AddressZero);
    expect(token.address).not.eq(constants.AddressZero);
  });

  it ('should create a plan', async() => {
    await payment
        .connect(await ethers.getSigner(merchant))
        .createPlan(token.address, tokenCreatePlanAmount_100, THIRTY_DAYS);
    const plan0 = await payment.plans(0);
    expect(plan0.token).eq(token.address);
    expect(plan0.amount).eq(tokenCreatePlanAmount_100);
    expect(plan0.frequency).eq(THIRTY_DAYS);

    await payment
        .connect(await ethers.getSigner(merchant))
        .createPlan(token.address, tokenCreatePlanAmount_200, SIXTY_DAYS);
    const plan1 = await payment.plans(1);
    expect(plan1.token).eq(token.address);
    expect(plan1.amount).eq(tokenCreatePlanAmount_200);
    expect(plan1.frequency).eq(SIXTY_DAYS);
  });

  it ('should create a subscription', async() => {
    await payment
        .connect(await ethers.getSigner(merchant))
        .createPlan(token.address, tokenCreatePlanAmount_100, THIRTY_DAYS);
    await payment
        .connect(await ethers.getSigner(subscriber))
        .subscribe(0); //subscribe(planId =0)

    const block = await ethers.provider.getBlock('latest');
    const subscription = await payment.subscriptions(subscriber,0);

    expect(subscription.subscriber).eq(subscriber);
    expect(subscription.start).eq(block.timestamp);
    expect(subscription.nextPayment).eq(block.timestamp + 86400 * 30);
  });

  it ('should subscribe and pay', async() => {
    // const {admin,merchant,subscriber,token,payment} = await setup();
    await payment
        .connect(await ethers.getSigner(merchant))
        .createPlan(token.address, tokenCreatePlanAmount_100, 0);
    await payment
        .connect(await ethers.getSigner(subscriber))
        .subscribe(0); //subscribe(planId =0)

    console.log(`${await token.balanceOf(merchant)},${await token.balanceOf(subscriber)}`);

    await payment
        .connect(await ethers.getSigner(subscriber))
        .pay(subscriber,0);
    console.log(`${await token.balanceOf(merchant)},${await token.balanceOf(subscriber)}`);

    await payment
        .connect(await ethers.getSigner(subscriber))
        .pay(subscriber,0);
    console.log(`${await token.balanceOf(merchant)},${await token.balanceOf(subscriber)}`);


  })


});
