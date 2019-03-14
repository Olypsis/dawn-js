const { Dawn } = require('../dist/src');

async function main() {
  // Send message from User1 to User1
  const user1 = new Dawn();

  const encryptedStream = user1.Files.createEncryptedStream(
    __dirname + '/file.json',
  );

  const decryptedStream = user1.Files.createDecryptAndWriteStream(
    encryptedStream,
    __dirname + '/file.out.json',
  );
}

main();
