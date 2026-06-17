const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// 1. Configure the JSON input structure required by newer solc versions
const input = {
	language: 'Solidity',
	sources: {
		'Inbox.sol': {
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

if (!output.contracts || !output.contracts['Inbox.sol'] || !output.contracts['Inbox.sol'].Inbox) {
	throw new Error('Compilation failed.');
}

// 3. Export the compiled contract data so your tests can use it
//console.log(JSON.stringify(output.contracts['Inbox.sol'].Inbox, null, 2));
module.exports = output.contracts['Inbox.sol'].Inbox;