const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

// 1. Configure the JSON input structure required by newer solc versions
const input = {
	language: 'Solidity',
	sources: {
		'Lottery.sol': {
			content: source,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['abi', 'evm.bytecode.object'], // This tells it to output ABI and Bytecode for all contracts
			},
		},
	},
};

// 2. Compile using the JSON string standard and parse the output back to an object
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
	for (const error of output.errors) {
		console.log(error.formattedMessage);
	}
}

if (!output.contracts || !output.contracts['Lottery.sol'] || !output.contracts['Lottery.sol'].Lottery) {
	throw new Error('Compilation failed.');
}

// 3. Export the compiled contract data so your tests can use it
//console.log(JSON.stringify(output.contracts['Lottery.sol'].Lottery, null, 2));
module.exports = output.contracts['Lottery.sol'].Lottery;