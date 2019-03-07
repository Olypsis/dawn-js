import { StatusJS, IStatusJS } from '../external/status-js-api';

export class Dawn {
  public statusJS: IStatusJS;
  public statusPublicKey?: string;
  public statusUsername?: string;
  public isListeningWithStatus: boolean;
  private testStatusProvider: string = 'http://35.188.163.32:8545';

  constructor() {
    this.statusJS = new StatusJS();
    this.isListeningWithStatus = false;
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
        `Connected to Status as ${this.statusUsername}. \nPublic Key: ${
          this.statusPublicKey
        }`,
      );

      // Listen For Messages
      await this.createStatusListener();

      return true;
    } catch (err) {
      // Something failed during connection
      console.log(err.message);
      return false;
    }
  }

  private async createStatusListener(): Promise<void> {
    try {
      console.log('Listening for messages...');
      this.isListeningWithStatus = true;
      await this.statusJS.onUserMessage((err: any, data: any) => {
        if (data) {
          const payload = JSON.parse(data.payload);
          console.log(`Payload Received! Payload: ${JSON.stringify(payload)}`);
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  }
}
