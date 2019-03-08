const { Dawn } = require('../dist/src');

const testStatusProvider = 'http://35.188.163.32:8545';
const testPrivateKey =
  '0x0011223344556677889900112233445566778899001122334455667788990010';

async function main() {
    const dawnJS = new Dawn();
    await dawnJS.connect(testStatusProvider, testPrivateKey);
    await dawnJS.createStatusListener();
    await dawnJS.statusUseMailservers();
}

main();