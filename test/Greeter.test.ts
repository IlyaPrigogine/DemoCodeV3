import { expect } from "chai";
import { ethers } from "hardhat";
import {MockToken, Payment} from "../typechain";

describe("Payment", function () {
  let payment: Payment;
  let mockToken : MockToken;
  beforeEach(async () => {
    payment = await ethers.getContract('Payment') as Payment;
    mockToken = await ethers.getContract('MockToken') as MockToken;
  });

  it ('test001', async() => {
    console.log(`payment: ${payment.address}`);
    console.log(`mockToken: ${mockToken.address}`);
  })

});
