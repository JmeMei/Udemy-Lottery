const assert = require('assert'); //Loads the built-in node.js tools
const { ethers } = require('hardhat'); // Use Hardhat's built-in tools, loads the ethers library, a standard tool to talk to Ethereum

//npx hardhat test --show-stack-traces
describe("Inbox", () => {
  let accounts;
  let inbox;
  const INITIAL_STRING = 'Hi there!';

  beforeEach(async () => { //async to ensure we wait for the accounts to be fetched before running tests
    //--- Hardhat provides a list of pre-funded accounts automatically
    accounts = await ethers.getSigners(); //Instead of web3.eth.getAccounts(), we use ethers.getSigners() to get the list of accounts provided by Hardhat. This returns an array of Signer objects, which represent the accounts and allow us to interact with them (e.g., send transactions).
    // Equivalent to your console.log(fetchedAccounts)
    // We print the address of the first account to verify it's connected
    console.log("Using account:", accounts[0].address);

    //--- DEPLOYMENT CODE ---//
    //Moved deployment to beforeEach so both tests can use the same contract 
    // 1) Using your compiled code
    const { abi, evm } = require('../compile');
    // 2) Create the factory
    const Inbox = await ethers.getContractFactory(abi, evm.bytecode.object);
    
    // --- INSERT .connect() HERE ---
    //If you want to use another account (e.g., accounts[2]) to deploy the contract, you can connect the factory to that account before deploying. This is done using the .connect() method on the factory. For example:
    // You are connecting the 'factory' to the 2nd account (index 1)
    // const inbox = await Inbox.connect(accounts[2]).deploy('Hi there!');

    // 3) Deploy
    inbox = await Inbox.deploy(INITIAL_STRING);
    await inbox.waitForDeployment();
    
    // 4) Log
    // console.log("Contract deployed at address:", inbox); 
    //console.log("Contract deployed at address:", inbox.target); // GOOD: Logs only what you actually need to see
    //console.log(inbox.interface.fragments.map(f => f.name)); // This will show you exactly which methods Ethers sees

    // 5) Assert
    //assert.ok(inbox.target); //f inbox.target is missing (is null or undefined), the assertion fails, and Mocha immediately stops the test and reports an error.
    //--- END OF DEPLOYMENT CODE ---//
  });

  it("deploys a contract", async () => {
    console.log("Test 1: Contract deployed at address:", inbox.target);
    assert.ok(inbox.target); // Verifies the contract has an address
  });

  it('has a default message', async () => {
    console.log("Test 2: Contract deployed at address:", inbox.target);
    const message = await inbox.message(); // Ethers calls the getter function directly
    assert.equal(message, 'Hi there!'); // Verifies that the default message is correct 
  });

  it('can change the message', async () => {
    console.log("Test 3: Contract deployed at address:", inbox.target);
    await inbox.setMessage('bye'); // Calls the setMessage function to change the message to 'bye'
    const message = await inbox.message(); // Retrieves the updated message
    assert.equal(message, 'bye'); // Verifies that the message was updated correctly
  });

});

// describe('Inbox', () => {
//     it('deploys a contract', async () => {
//         // You will use the bytecode and abi you compiled earlier
//         const { abi, evm } = require('../compile');
        
//         // This is how you deploy using Hardhat/Ethers
//         const Inbox = await ethers.getContractFactoryFromArtifact({
//             abi: abi,
//             bytecode: evm.bytecode.object
//         });
//         const inbox = await Inbox.deploy('Hi there!');
        
//         assert.ok(inbox.target); // Verifies the contract has an address
//     });
// });

// it('deploys a contract', async () => {
//     const { abi, evm } = require('../compile');
    
//     // Create the factory using the abi and bytecode directly
//     const Inbox = await ethers.getContractFactory(abi, evm.bytecode.object);
//     const inbox = await Inbox.deploy('Hi there!');
    
//     // In newer ethers (v6+), wait for the deployment to finish
//     await inbox.waitForDeployment();
    
//     // Verify the address
//     assert.ok(inbox.target); 
// });

// class Car {
//     park() {
//         return 'stopped';
//     }

//     drive() {
//         return 'vroom';
//     }
// }

// let car; 
// beforeEach(() => {
//     car = new Car();
// });

// describe('Car', () => {
//     it('can park', () => {
//         assert.equal(car.park(), 'stopped');
//     });

//     it('can drive', () => {
//         assert.equal(car.drive(), 'vroom');
//     });
// });