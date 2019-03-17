const { Dawn } = require('../dist/src');

const file = __dirname + '/static/test.pdf';
const outFile =  __dirname + "/static/out." + file.split('.')[1]

async function main() {
  // Send message from User1 to User1
  const user1 = new Dawn();

  // Upload File to IPFS
  const { hash } = await user1.encryptUploadToIPFS(file);
  await user1.downloadDecryptFromIPFS(hash, outFile);

}

main();
