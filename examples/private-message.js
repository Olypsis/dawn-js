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

  const user1pubKey = status1.statusPublicKey;
  const user2pubKey = status2.statusPublicKey;

  console.log(
    'user1 (' + (await status1.statusUsername) + '):\n' + user1pubKey,
  );
  console.log(
    'user2 (' + (await status2.statusUsername) + '):\n' + user2pubKey,
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

  await status1.createStatusListener();
  await status2.createStatusListener();

  await status1.sendStatusMessage(user2pubKey, 'hello tester!');
  await status2.sendStatusMessage(user1pubKey, 'hello user1!');

  await status1.sendJsonMessage(user2pubKey, {x: 3});
  await status2.sendJsonMessage(user1pubKey, {y: "bitch"});
})();
