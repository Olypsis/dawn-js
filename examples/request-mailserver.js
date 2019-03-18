const { Dawn } = require('../dist/src');

const file1 = __dirname + '/static/test.pdf';
const file2 = __dirname + '/static/test.json';
const outFile1 = __dirname + '/static/out.' + file1.split('.')[1];
const outFile2 = __dirname + '/static/out.' + file2.split('.')[1];

const testPrivateKey =
  '0x62478ad61025df152edc540e2b398d38e9da3428ddae0177b3658d6ed9c3431e';

async function main() {
  //   User 1
  const user1 = new Dawn();
  await user1.connect();

  // User 2
  const user2 = new Dawn();
  await user2.connect(undefined, testPrivateKey);

  // Transfer file to User2
  await user1.transferFile(user2.Status.publicKey, file2);

  //   Reconnect a "new User" to the same private key
  setTimeout(async () => {
    const newUser2 = new Dawn();
    // Connect (request Mailserver messages)
    await newUser2.connect(undefined, testPrivateKey);

    console.time('getMailserverInbox');

    // Log time it takes to retrieve this message from the mailserver
    const getMailserverInbox = setInterval(async () => {
      const inbox = await newUser2.getInbox();
      if (inbox.length > 0) {
        console.log("Mailserver Inbox length:", inbox.length)
        console.timeEnd('getMailserverInbox');
        clearInterval(getMailserverInbox);
      }
    }, 3000);
  });
}

main();
