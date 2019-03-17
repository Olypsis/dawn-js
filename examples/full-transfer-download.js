const { Dawn } = require('../dist/src');

const file1 = __dirname + '/static/test.html';
const file2 = __dirname + '/static/test.json';
const outFile1 = __dirname + '/static/out.' + file1.split('.')[1];
const outFile2 = __dirname + '/static/out.' + file2.split('.')[1];

async function main() {
  try {
    // User 1

    const user1 = new Dawn();
    await user1.connect();

    // Hack - wait for IPFS Node ready
    setTimeout(async () => {
      // Upload File and Send via Status to self
      await user1.transferFile(user1.Status.publicKey, file1);

      // Wait for message recieved by Status listener
      console.log('Waiting for message recieved...');
      setTimeout(async () => {
        const inbox = await user1.getInbox();
        console.log('inbox:', inbox);

        // Upon recieving message from self, download file from payload
        await user1.downloadFileFromInbox(0, outFile1);
      }, 3000);
    }, 3000);
  } catch (err) {
    console.log('main:', err);
  }
}

main();
