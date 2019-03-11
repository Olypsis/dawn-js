import { Dawn } from '../index';

test('Dawn Connects To Status', async () => {
  const dawnJS = new Dawn();
  expect(await dawnJS.connect()).toEqual(true);
  expect(typeof dawnJS.Status.publicKey).toBe('string');
  expect(typeof dawnJS.Status.username).toBe('string');
});

test('Dawn Creates a listener', async () => {
  const dawnJS = new Dawn();
  await dawnJS.connect();
  expect(await dawnJS.Status.createListener()).toBe(true);
});

test('Dawn Successfully Requests Historic Messages', async () => {
  const dawnJS = new Dawn();
  await dawnJS.connect();
  expect(await dawnJS.Status.useMailservers()).toBe(true);
});

// FIXME: Test does not work
test('Dawn Can Send and Recieve Messages', async () => {
  const url = 'http://35.188.163.32:8545';

  // Create two Dawn users and connect them to the status node
  const user1 = new Dawn();
  const user2 = new Dawn();

  await user1.connect();
  await user2.connect(
    undefined,
    '0x0011223344556677889900112233445566778899001122334455667788990010',
  );

  console.log(typeof user1.Status.statusPublicKey, typeof user2.Status.statusPublicKey);

  // Turn on message listeners
  await user1.Status.createListener();
  await user2.Status.createListener();

  const user1PublicKey = user1.Status.publicKey;
  const user2PublicKey = user2.Status.publicKey;

  // // Send a message between user1 <-> user2
  await user1.Status.sendMessage("0x04dfad5c0b1c9ac25300cfe6bb1f581799e4314ecd43bd916bd07736a593641f0beecbef3719dec1426469a43e98b61f5539ae912294caf8fe5e50cee349a1cc69", 'hello user2!');
  // await user2.sendStatusMessage(user1PublicKey, 'hello user1!');
});
