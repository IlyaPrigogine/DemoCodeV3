import { expect } from "chai";
import {ethers, getNamedAccounts} from "hardhat";
import {MockToken, Payment} from "../typechain";
import {constants} from "ethers";

const THIRTY_DAYS = 86400 * 30;
const SIXTY_DAYS = 86400 * 60;

describe("Payment", async () => {
  const {owner, user1,user2} = await getNamedAccounts();
  const [admin,merchant, subscriber] = [owner, user1, user2];
  let payment: Payment;
  let token : MockToken;
  beforeEach(async () => {
    payment = await ethers.getContract('Payment') as Payment;
    token = await ethers.getContract('MockToken') as MockToken;
    await token.transfer(subscriber,1000);
    await token
        .connect(await ethers.getSigner(subscriber))
        .approve(payment.address,1000);
  });

  it ('test001', async() => {
    expect(payment.address).not.eq(constants.AddressZero);
    expect(token.address).not.eq(constants.AddressZero);
  });

  it ('should create a plan', async() => {
    await payment
        .connect(await ethers.getSigner(merchant))
        .createPlan(token.address, 100, THIRTY_DAYS);
    const plan0 = await payment.plans(0);
    expect(plan0.token).eq(token.address);
    expect(plan0.amount).eq(100);
    expect(plan0.frequency).eq(THIRTY_DAYS);

    await payment
        .connect(await ethers.getSigner(merchant))
        .createPlan(token.address, 200, SIXTY_DAYS);
    const plan1 = await payment.plans(1);
    expect(plan1.token).eq(token.address);
    expect(plan1.amount).eq(200);
    expect(plan1.frequency).eq(SIXTY_DAYS);
  })

});
