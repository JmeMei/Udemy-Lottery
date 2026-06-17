require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Make sure this is here to read your .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  localhost: {
      url: "http://127.0.0.1:8545",
    },
  // networks: {
  //   sepolia: {
  //     url: process.env.SEPOLIA_URL, // This matches the key in your .env
  //     accounts: [process.env.SEPOLIA_PRIVATE_KEY] // This matches the key in your .env
  //   }
  // }
};
