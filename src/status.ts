import { StatusJS, IStatusJS } from '../external/status-js-api';
import { rejects } from 'assert';
const _ = require('lodash');
const shortid = require('shortid');
const path = require('path');


export class Status {
  public instance: IStatusJS;
  public publicKey?: string;
  public username?: string;

  private rawInbox: any[] = [];
  private cleanInbox: any[] = [];


  // Test values
  private testStatusProvider: string = 'http://35.188.163.32:8545';
  private enode: string =
    'enode://015e22f6cd2b44c8a51bd7a23555e271e0759c7d7f52432719665a74966f2da456d28e154e836bee6092b4d686fe67e331655586c57b718be3997c1629d24167@35.226.21.19:30504';

  constructor() {
    this.instance = new StatusJS();
  }

  public async connect(
    statusProvider: string = this.testStatusProvider,
    privateKey?: string,
  ): Promise<boolean> {
    try {
      console.log('Attempting connection to status node...');

      // Connect to Status Provider
      await this.instance.connect(statusProvider, privateKey);

      // Get Public Key and Username
      this.publicKey = await this.instance.getPublicKey();
      this.username = await this.instance.getUserName();
      console.log(
        `Connected to Status as ${this.username}. \nPublic Key: ${
          this.publicKey
        }`,
      );
      return true;
    } catch (err) {
      // Something failed during connection
      console.log('Something failed:', err);
      return false;
    }
  }

  public createListener(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.instance.onUserMessage((err: any, data: any) => {
          if (err) {
            throw err;
          }
          if (data) {
            const payload = JSON.parse(data.payload);
            // console.log(
            //   `Payload Received! Payload: ${JSON.stringify(payload)}`,
            // );

            // Check content type is `content/json`
            if (payload[1][1] === 'content/json') {
              // Push nested payload from status message to raw inbox
              this.rawInbox.push(payload[1][0]);
            }
          }
        });
        console.log('Listening for messages...');
        resolve(true);
      } catch (err) {
        // .onUserMessage() failed
        console.log('createStatusListener:', err);
        reject(false);
      }
    });
  }

  // Queries for historic messages
  public useMailservers(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.instance.mailservers.useMailserver(
          this.enode,
          (err: any, res: any) => {
            if (err) {
              throw err;
            }
            // Set a 24 hour time window starting from current time
            let from: number = parseInt(
              (new Date().getTime() / 1000 - 86400).toString(),
              10,
            );
            let to: number = parseInt(
              (new Date().getTime() / 1000).toString(),
              10,
            );

            // Request private user messages - return
            this.instance.mailservers.requestUserMessages(
              { from, to },
              (err: any, res: any) => {
                if (err) {
                  throw err;
                } else {
                  console.log(
                    `Messages requested from mailserver from ${from} to ${to}.`,
                  );
                  resolve(res);
                }
              },
            );
          },
        );
      } catch (err) {
        console.log('statusUseMailservers:', err);
        reject(err);
      }
    });
  }

  public sendMessage(publicKey: string, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Send message to a publickey via status
        this.instance.sendUserMessage(
          publicKey,
          message,
          (err: any, res: any) => {
            if (err) {
              throw err;
            } else {
              console.log(
                `sendStatusMessage: Message sent to publickey ${publicKey}.`,
              );
              console.log(`sendStatusMessage: Message: ${message}.`);
              resolve(true);
            }
          },
        );
      } catch (err) {
        console.log(new Error('sendStatusMessage: ' + err));
        reject(err);
      }
    });
  }

  public sendJsonMessage(publicKey: string, payload: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const stringifiedJSON: string = JSON.stringify(payload);
        // Send message to a publickey via status
        this.instance.sendJsonMessage(
          publicKey,
          payload,
          (err: any, res: any) => {
            if (err) {
              throw err;
            } else {
              console.log(
                `sendJsonMessage: JSON sent to publickey ${publicKey}.`,
              );
              resolve(true);
            }
          },
        );
      } catch (err) {
        // .sendJsonMessage() failed
        console.log('sendJsonMessage:', err);
        reject(false);
      }
    });
  }

  public constructJSONPayload(fileData: any, filePath: string) {
    const fileName = path.parse(filePath).base

    const payload = {
      date: parseInt(
        (new Date().getTime() / 1000).toString(),
        10,
      ),
      fileName,
      hash: fileData.hash,
      id: shortid.generate(),
      key: 'password',
      path: fileData.path,
      size: fileData.size,
    };
    return payload;
  }

  public getCleanInbox(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      try {
        const { rawInbox } = this;
        const dedupedInbox = _.uniqBy(rawInbox, 'id');
        const sortedInbox = _.orderBy(dedupedInbox, ['date'], ['desc']);
        this.cleanInbox = sortedInbox;
        resolve(sortedInbox);
      } catch (err) {
        reject(err);
      }
    });
  }
}
