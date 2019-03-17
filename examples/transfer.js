const { Dawn } = require('../dist/src');

const file1 = __dirname + '/static/test.pdf';
const file2 = __dirname + '/static/test.json';
const outFile1 = __dirname + '/static/out.' + file1.split('.')[1];
const outFile2 = __dirname + '/static/out.' + file2.split('.')[1];


async function main() {
  const user1 = new Dawn();
  await user1.connect();

  // Upload File and Send via Status to self
  const result1 = await user1.transferFile(user1.Status.publicKey, file1);
  const result2 = await user1.transferFile(user1.Status.publicKey, file2);
  console.log('main', result1);
  console.log('main', result2);


  // Wait for message recieved by listener
  setTimeout(async () => {
    const inbox = await user1.getInbox();
    console.log('main', inbox);
    
  }, 3000);
}

main();
