const { Dawn } = require('../dist/src');

const file = __dirname + '/static/test.pdf';
const outFile = __dirname + '/static/out.' + file.split('.')[1];

async function main() {
  const user1 = new Dawn();
  await user1.connect();

  // Upload File and Send via Status
  const result = await user1.transferFile(user1.Status.publicKey, file);
  console.log('main', result);
  
  //   await user1.getFile(hash, outFile);
}

main();
