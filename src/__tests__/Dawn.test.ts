import { Dawn } from '../index';

test('Dawn Connects To Status', async () => {
  const dawnJS = new Dawn();
  expect(await dawnJS.connect()).toEqual(true);
  expect(typeof dawnJS.statusPublicKey).toBe('string');
  expect(typeof dawnJS.statusUsername).toBe('string');
});

test('Dawn Creates a listener', async () => {
  const dawnJS = new Dawn();
  await dawnJS.connect();
  expect(await dawnJS.createStatusListener()).toBe(true);
});


test('Dawn Successfully Requests Historic Messages', async () => {
  const dawnJS = new Dawn();
  await dawnJS.connect();
  expect(await dawnJS.statusUseMailservers()).toBe(true);
});
