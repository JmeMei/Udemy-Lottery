const assert = require('assert');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery Contract", () => {
  let lottery;
  let owner;
  let addr1;

  beforeEach(async () => {
    // 1. Get the accounts from Hardhat
    [owner, addr1, addr2] = await ethers.getSigners();

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

  it("allows multiple accounts to enter", async () => {
    await lottery.connect(addr1).enter({ 
      value: ethers.parseEther("0.02") 
    });
    
    await lottery.connect(addr2).enter({ 
      value: ethers.parseEther("0.02") 
    });

    const players = await lottery.getPlayers();
    expect(players[0]).to.equal(addr1.address);
    expect(players[1]).to.equal(addr2.address);
    expect(players.length).to.equal(2);
  });

  it('requires a minimum amount of ether to enter', async () => {
    await expect(
      lottery.connect(addr1).enter({ value: ethers.parseEther("0.001") })
    ).to.be.revertedWith("Minimum ether required to enter is 0.01");
  });

  it('only allows the manager to pick a winner', async () => {
    await lottery.connect(addr1).enter({ 
      value: ethers.parseEther("0.02") 
    });

    await expect(
      lottery.connect(addr1).pickWinner()
    ).to.be.revertedWith("Only the manager can call this function");
  });

  it('sends money to the winner and resets the players array', async () => {
    await lottery.connect(addr1).enter({ 
      value: ethers.parseEther("2") 
    });

    const initialBalance = await ethers.provider.getBalance(addr1.address);

    await lottery.connect(owner).pickWinner();

    const finalBalance = await ethers.provider.getBalance(addr1.address);
    const difference = finalBalance - initialBalance;

    console.log("Difference in Wei:", difference.toString());
    console.log("Expected in Wei:", ethers.parseEther("2").toString());

    expect(difference).to.be.closeTo(ethers.parseEther("2"), ethers.parseEther("0.01"));

    const players = await lottery.getPlayers();
    expect(players.length).to.equal(0);
  });
});