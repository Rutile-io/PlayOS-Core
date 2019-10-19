const fs = require('fs');
const executeTransaction = require('./lib/executeTransaction');

async function execute() {
    const data = fs.readFileSync('./deployedAddress.json');
    const parsedData = JSON.parse(data.toString());

    executeTransaction(parsedData.address);
}


execute();
