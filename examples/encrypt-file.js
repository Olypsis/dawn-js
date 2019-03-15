const { Dawn } = require('../dist/src');

const file = __dirname + '/static/test.json';
const outFile =  __dirname + "/static/out.json"

async function main() {
  // Send message from User1 to User1
  const user1 = new Dawn();

  // Upload File to IPFS
  const { hash } = await user1.transferFile(file);
  await user1.getFile(hash, outFile);

}

main();
