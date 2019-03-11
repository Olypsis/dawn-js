const { Dawn } = require('../dist/src');
const Web3 = require('web3');

(async () => {
  const url = 'http://35.188.163.32:8545';
  let status1 = new Dawn();
  let status2 = new Dawn();
  await status1.connect(url);
  await status2.connect(
    url,
    '0x0011223344556677889900112233445566778899001122334455667788990010',
  );

  const user1pubKey = status1.Status.publicKey;
  const user2pubKey = status2.Status.publicKey;

  console.log(
    'user1 (' + (await status1.Status.username) + '):\n' + user1pubKey,
  );
  console.log(
    'user2 (' + (await status2.Status.username) + '):\n' + user2pubKey,
  );
  console.log('\n');

  const receivedMessageCb = username => (err, data) => {
    if (err) {
      console.error('Error: ' + err);
      return;
    }
    console.log(username + ' received a message from ' + data.username);
    console.log(data.data.sig);
    console.log(data.payload);
  };

  await status1.Status.createListener();
  await status2.Status.createListener();

  await status1.Status.sendMessage(user2pubKey, 'hello tester!');
  await status2.Status.sendMessage(user1pubKey, 'hello user1!');

  await status1.Status.sendJsonMessage(user2pubKey, {x: 3});
  await status2.Status.sendJsonMessage(user1pubKey, {y: "bitch"});
})();
