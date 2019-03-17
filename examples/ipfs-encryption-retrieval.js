const { Dawn } = require('../dist/src');

const file = __dirname + '/static/test.json';
const outFile = __dirname + '/static/out.' + file.split('.')[1];

async function main() {
  // Send message from User1 to User1
  const user1 = new Dawn();
  // Wait for IPFS to load
  setTimeout(async () => {
    // Upload File to IPFS
    const { hash } = await user1.encryptUploadToIPFS(file);
// Decrypt file from IPFS
    await user1.downloadDecryptFromIPFS(hash, 'password', outFile);
  }, 3000);
}

main();
