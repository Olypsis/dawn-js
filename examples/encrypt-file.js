const { Dawn } = require('../dist/src');

const file = __dirname + '/test.json';

async function main() {
  // Send message from User1 to User1
  const user1 = new Dawn();

  await user1.transferFile(file);

  //   const encryptedStream = user1.Files.createEncryptedStream(
  //     __dirname + '/test.json',
  //   );

  //   user1.Files.createDecryptAndWriteStream(
  //     encryptedStream,
  //     __dirname + '/test.out.json',
  //   );
}

main();
