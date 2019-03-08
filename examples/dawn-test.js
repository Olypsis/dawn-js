const { Dawn } = require('../dist/src');

const testStatusProvider = 'http://35.188.163.32:8545';
const testPrivateKey =
  '0x0011223344556677889900112233445566778899001122334455667788990011';

const dawnJS = new Dawn();
dawnJS.connect(testStatusProvider, testPrivateKey);
