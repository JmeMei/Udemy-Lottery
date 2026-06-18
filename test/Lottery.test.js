const assert = require('assert');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery Contract", () => {
  let lottery;
  let owner;
  let addr1;

  beforeEach(async () => {
    // 1. Get the accounts from Hardhat
    [owner, addr1] = await ethers.getSigners();

    // 2. Get the Contract Factory
    // Hardhat looks for the "Lottery" contract in your artifacts folder automatically
    const Lottery = await ethers.getContractFactory("Lottery");

    // 3. Deploy the contract
    // If your constructor takes arguments, put them here
    lottery = await Lottery.deploy();
    await lottery.waitForDeployment();
    
    console.log("Contract deployed to:", lottery.target);
  });

  it("deploys a contract", async () => {
    expect(lottery.target).to.not.be.null;
  });

  it("allows one account to enter", async () => {
    await lottery.connect(addr1).enter({ 
      value: ethers.parseEther("0.02") 
    });
    
    const players = await lottery.getPlayers();
    expect(players[0]).to.equal(addr1.address);
    expect(players.length).to.equal(1);
  });
});