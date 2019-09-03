const { Dawn } = require('../dist/src');

const file = __dirname + '/static/test.json';
const outFile = __dirname + '/static/out.' + file.split('.')[1];

async function main() {
  // User 1
  const user1 = new Dawn();
  await user1.connect();

  // Upload File and Send via Status to self
  await user1.transferFile(user1.Status.publicKey, file);

  // Wait for message recieved by listener
  console.log('Waiting for message recieved...');
  setTimeout(async () => {
    const inbox = await user1.getInbox();
    console.log('inbox:', inbox);
  }, 3000);
}

main();
