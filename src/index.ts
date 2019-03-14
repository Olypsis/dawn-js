import { Status } from './status';
import { IPFS } from './ipfs';

import { rejects } from 'assert';

export class Dawn {
  public Status?: any;
  public IPFS?: any;

  // Test values
  private testStatusProvider: string = 'http://35.188.163.32:8545';
  private enode: string =
    'enode://015e22f6cd2b44c8a51bd7a23555e271e0759c7d7f52432719665a74966f2da456d28e154e836bee6092b4d686fe67e331655586c57b718be3997c1629d24167@35.226.21.19:30504';

  constructor() {
    this.Status = new Status();
    this.IPFS = new IPFS();
  }

  public async connect(
    statusProvider: string = this.testStatusProvider,
    privateKey?: string,
  ): Promise<boolean> {
    try {
      // Connect to Status Provider
      await this.Status.connect(statusProvider, privateKey);

      return true;
    } catch (err) {
      // Something failed during connection
      console.log('Something failed:', err);
      return false;
    }
  }

  // Upload and send file
  /*
  file:
  to: 
  message:
  */

  //Retrieve files sent to me

  // Download and Decrypt a file
  /*
  hash:
  key: 
  */

  // Check my messages
}
