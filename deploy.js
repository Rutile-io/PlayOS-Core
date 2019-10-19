const Web3 = require('web3');
const fetch = require('node-fetch');
const fs = require('fs');
const IPFS = require('ipfs-mini');
const ethers = require('ethers');
const EthereumTx = require('ethereumjs-tx').Transaction;
const executeTransaction = require('./lib/executeTransaction');

const ipfsConfig = {
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http',
};

const chainId = 866;
const rutileUrl = 'http://localhost:8545';
const privateKey = 'C0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DEC0DE';
const accountAddress = '0x53ae893e4b22d707943299a8d0c844df0e3d5557';

const wallet = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider(rutileUrl, {
    chainId,
}));

function stringToHex(str) {
    let result = '';

    for (var i=0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }

    return '0x' + result;
}

function byteArrayToString(arr) {
    return String.fromCharCode.apply(null, arr);
}


function addToIpfs(file) {
    return new Promise((resolve, reject) => {
        const ipfs = new IPFS(ipfsConfig);

        ipfs.add(file, (error, result) => {
            if (error) {
                return reject(error);
            }

            resolve(result);
        });
    });
}

function pollTransactionStatus(hash, ms) {
    return new Promise(async (resolve) => {
        const response = await fetch(rutileUrl, {
            method: 'POST',
            body: JSON.stringify({
                method: 'eth_getTransactionReceipt',
                jsonrpc: '2.0',
                id: 1,
                params: [hash],
            }),
        });

        const data = await response.json();

        if (data.result === null) {
            setTimeout(async () => {
                const result = await pollTransactionStatus(hash, ms);

                resolve(result);
            }, ms);
        } else {
            resolve(data.result);
        }
    });
}

async function deploy() {
    const file = fs.readFileSync('./build/untouched.wasm');
    const wasm = byteArrayToString(new Uint8Array(file));
    console.log('📦 Uploading to IPFS');
    const hash = await addToIpfs(wasm);
    const nonce = await wallet.getTransactionCount();

    const txParams = {
        chainId,
        data: stringToHex(hash),
        gasLimit: 8000000,
        gasPrice: 1,
        nonce,
        to: null,
        value: 0,
    };

    try {
        console.log('📬 Sending transaction');
        const tx = await wallet.sendTransaction(txParams);
    } catch (error) {
        // We have to use the error for now until we fix Rutile's internal TX structure
        const txHash = error.returnedHash;
        const result = await pollTransactionStatus(txHash, 2000);

        fs.writeFileSync('./deployedAddress.json', JSON.stringify({
            address: result.contractAddress,
        }));

        console.log('⛓ Executing on chain');
        executeTransaction(result.contractAddress);
    }
}

deploy();
