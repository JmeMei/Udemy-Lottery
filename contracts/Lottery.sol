// SPDX-License-Identifier: MIT

//pragma solidity ^0.4.17;
//pragma experimental ABIEncoderV2; // This unlocks the "No Dice" zone
pragma solidity ^0.8.24;

contract Lottery {

    address public manager;
    //this contains a dynamic array that only contains addresses
    //"public" because im okay for people to see who has entered
    //address payable means these addresses can receive Ether.
    address payable[] public players;


    constructor() payable{
        manager = msg.sender; //address of person who created the contract
    }

    //allows the user to join
    function enter() public payable { //public because we want to allow anyone to call this function
        //in order to enter, we have to send some amount of ether, hence, "payable" function
        require(msg.value > .01 ether, "Minimum contribution is 0.01 Ether"); //used for validation
        players.push(payable(msg.sender)); //convert the sender’s address into a payable address
    }

    function random() public view returns (uint){
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    function pickWinner() public OnlyManager {
        //require(msg.sender == manager); //dont need this because theres a modifier

        uint index = random() % players.length; 
        // Replace this:
        // players[index].transfer(address(this).balance); //players[index] -> this will return address

        // With this:
        (bool success, ) = players[index].call{value: address(this).balance}("");
        require(success, "Transfer failed.");
        
        players = new address payable[](0);
    }

    modifier OnlyManager() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address payable[] memory){
        return players;
    }

}

// contract Test{
//     string[] public myArray;

//     constructor() {
//         myArray.push("hi");
//     }

//     //returns the entire array
//     function getArray() public view returns (string[] memory){
//         return myArray;
//     }
// }