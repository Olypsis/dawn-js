const { Dawn } = require('../dist/src');

async function main() {
  // Send message from User1 to User1
  const user1 = new Dawn();
  await user1.connect();
  const { path, hash } = await user1.IPFS.addFile(
    Buffer.from('hello'),
    'hello.txt',
  );

  console.log('Added file:', path, hash);


  // Get File
  const files = await user1.IPFS.getFile(hash);
  console.log(files);
}
main();
