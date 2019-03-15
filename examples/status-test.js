const { Dawn } = require('../dist/src');

const testStatusProvider = 'http://35.188.163.32:8545';
const testPrivateKey =
  '0x0011223344556677889900112233445566778899001122334455667788990010';

async function main() {
    // Send message from User1 to User1
    const user1 = new Dawn();
    await user1.connect(testStatusProvider, testPrivateKey);
    await user1.Status.createListener();
    await user1.Status.useMailservers();
    await user1.Status.sendMessage(user1.Status.publicKey, "Hello from self");

    // New User2
    const user2 = new Dawn();
    await user2.connect(testStatusProvider, testPrivateKey);
    await user2.Status.createListener();

    // Send message from User1 to User2
    await user1.Status.sendMessage(user2.Status.publicKey, "Hello user2 - from user1");
}

main();