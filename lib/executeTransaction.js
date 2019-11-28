const config = require('../config');
const ethers = require('ethers');
const pollTransactionStatus = require('./pollTransaction');

// 0x0cb3ae60b3e23bf2fb3454bc15ce8dddb7803110bcf793d7d983129d6635f734

module.exports = async function executeTransaction(address) {
    const wallet = new ethers.Wallet(config.privateKey, new ethers.providers.JsonRpcProvider(config.rutileUrl, {
        chainId: config.chainId,
    }));

    const nonce = await wallet.getTransactionCount();

    const txParams = {
        chainId: config.chainId,
        // Datasync set
        data: '0x000000016fd014d4a0c005f49869f2e9431322ce745722d9f88311fef41fad61b00986216fd014d4a0c005f49869f2e9431322ce745722d9f88311fef41fad61b0098623',
        // Datasync get
        // data: '0x000000026fd014d4a0c005f49869f2e9431322ce745722d9f88311fef41fad61b0098621',
        gasLimit: 8000000,
        gasPrice: 1,
        nonce,
        to: address,
        value: 0,
    }

    try {
        await wallet.sendTransaction(txParams);
    } catch (error) {
        const txHash = error.returnedHash;
        const result = await pollTransactionStatus(txHash, 2000);

        console.log('[] result -> ', result);
    }
}
