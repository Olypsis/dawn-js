import { StatusJS, IStatusJS } from '../external/status-js-api';

export class Dawn {
  public statusJS: IStatusJS;
  public statusPublicKey?: string;
  public statusUsername?: string;
  public isListeningWithStatus: boolean;

  // Test values
  private testStatusProvider: string = 'http://35.188.163.32:8545';
  private enode: string =
    'enode://015e22f6cd2b44c8a51bd7a23555e271e0759c7d7f52432719665a74966f2da456d28e154e836bee6092b4d686fe67e331655586c57b718be3997c1629d24167@35.226.21.19:30504';

  private rawInbox: any[] = [];

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

      console.log("Attempting connection to status node...");
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

      // Request from mailserver
      await this.statusUseMailservers();

      return true;
    } catch (err) {
      // Something failed during connection
      console.log("Something failed:", err);
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
          this.rawInbox.push(payload);
          console.log("Inbox Length: ", this.rawInbox.length);
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  // Queries for historic messages
  public async statusUseMailservers(): Promise<any> {
    await this.statusJS.mailservers.useMailserver(
      this.enode,
      async (err: any, res: any) => {
        // Set a 24 hour time window starting from current time
        let from: number = parseInt(
          (new Date().getTime() / 1000 - 86400).toString(),
          10,
        );
        let to: number = parseInt((new Date().getTime() / 1000).toString(), 10);

        // Request private user messages - return 
        await this.statusJS.mailservers.requestUserMessages(
          { from, to },
          (err: any, res: any) => {
            if (err) {
              console.log(err);
              return false;
            } else {
              console.log(`Messages requested from mailserver from ${from} to ${to}.`);
              return true;
            }
          },
        );
      },
    );
  }
}
