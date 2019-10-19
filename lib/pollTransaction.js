const fetch = require('node-fetch');
const config = require('../config');

module.exports = function pollTransactionStatus(hash, ms) {
    return new Promise(async (resolve) => {
        const response = await fetch(config.rutileUrl, {
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
