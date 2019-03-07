import {StatusJS} from '../external/status-js-api';

export class Dawn {
  public statusJS: StatusJS;
  public statusPublicKey?: string;
  public statusUsername?: string;
  private testStatusProvider: string = 'http://35.188.163.32:8545';

  constructor() {
    this.statusJS = new StatusJS();
    console.log('Dawn and Status initialized');
  }

  public async connect(
    statusProvider: string = this.testStatusProvider,
    privateKey?: string,
  ): Promise<boolean> {
    try {
      // Connect to Status Provider
      await this.statusJS.connect(statusProvider, privateKey);

      // Get Public Key and Username
      this.statusPublicKey = await this.statusJS.getPublicKey();
      this.statusUsername = await this.statusJS.getUserName();
      console.log(
        `Connected to Status as ${this.statusUsername}. Public Key: ${
          this.statusPublicKey
        }`,
      );

      return true;
    } catch (err) {
      // Something failed during connection
      console.log(err.message);
      return false;
    }
  }
}
