const hre = require("hardhat");

async function main() {
  // Use the exact address from your deployment output
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Get the contract instance
  const Inbox = await hre.ethers.getContractFactory("Inbox");
  const inbox = await Inbox.attach(CONTRACT_ADDRESS);

  // Call the function (if your public variable is named 'message')
  const message = await inbox.message(); 
  
  console.log("The value of message is:", message);
}

main().catch(console.error);