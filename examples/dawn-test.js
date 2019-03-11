const { Dawn } = require('../dist/src');

const testStatusProvider = 'http://35.188.163.32:8545';
const testPrivateKey =
  '0x0011223344556677889900112233445566778899001122334455667788990010';

async function main() {
    const user1 = new Dawn();
    await user1.connect(testStatusProvider, testPrivateKey);
    await user1.createStatusListener();
    await user1.statusUseMailservers();

    const publicKey = user1.statusPublicKey;

    await user1.sendStatusMessage(publicKey, "Hello from self");

    // User 2
    const user2 = new Dawn();
    await user2.connect(testStatusProvider, testPrivateKey);
    await user2.createStatusListener();
    await user1.sendStatusMessage(user2.statusPublicKey, "Hello user2 - from user1");
}

main();