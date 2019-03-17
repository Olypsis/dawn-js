import { Status } from './status';
import { IPFS } from './ipfs';
import { Files } from './files';

import { rejects } from 'assert';


export class Dawn {
  public Status?: any;
  public IPFS?: any;
  public Files?: any;

  public isConnected: boolean = false;

  // Test values
  private testStatusProvider: string = 'http://35.188.163.32:8545';
  private enode: string =
    'enode://015e22f6cd2b44c8a51bd7a23555e271e0759c7d7f52432719665a74966f2da456d28e154e836bee6092b4d686fe67e331655586c57b718be3997c1629d24167@35.226.21.19:30504';

  constructor() {
    this.Status = new Status();
    this.IPFS = new IPFS();
    this.Files = new Files();
    console.log('Dawn, Status and IPFS initialized');
  }

  // GetInbox

  // Connect to Status, IPFS etc
  public async connect(
    statusProvider: string = this.testStatusProvider,
    privateKey?: string,
  ): Promise<boolean> {
    try {
      // Connect to Status Provider
      await this.Status.connect(statusProvider, privateKey);

      // Listen for incoming messages
      await this.Status.createListener();

      // Request historic Mailserver messages
      const res = await this.Status.useMailservers();
      // console.log("connect: mailservers:", res)

      this.isConnected = true;

      return res;
    } catch (err) {
      // Something failed during connection
      console.log('Something failed:', err);
      return false;
    }
  }

  // Upload, Encrypt, Add to IPFS and Send a single file
  /*
  filePath:
  receiverAddress: 
  message:
  */

  // Returns Confirmation of file that was sent,
  public transferFile(
    receiverAddress: string,
    filePath: string,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get IPFS fileData after upload: {hash, path, size}
        const fileData = await this.encryptUploadToIPFS(filePath);

        // Construct JSON message payload
        const payload: any = this.Status.constructJSONPayload(fileData, filePath);

        // Send JSON payload to reciever's public key through Status
        const result = await this.Status.sendJsonMessage(
          receiverAddress,
          payload,
        );

        resolve(result);
      } catch (err) {
        console.log('transferFile:', err);
        reject(err);
      }
    });
  }

  //Retrieve files sent to me
  // If connected to status, return inbox
  public async getInbox(): Promise<any[]> {
    try {
      if (this.isConnected) {
        const inbox: any[] = await this.Status.getCleanInbox();
        return inbox;
      }
      throw new Error('Not Connected to Dawn. Run Dawn.connect() first!');
    } catch (err) {
      throw err;
    }
  }

  // Upload, Encrypt, Add to IPFS for a single file
  /*
  filePath:
  receiverAddress: 
  message:
  */
  public async encryptUploadToIPFS(filePath: string) {
    try {
      // Create stream for reading and encrypting file
      const encryptedStream: any = await this.Files.createEncryptedStream(
        filePath,
      );
      // Result is an Array[Object] containing `hash`, `path` and `size` from IPFS operation
      const ipfsAddedFiles: any = await this.IPFS.addFileStream(
        encryptedStream,
      );
      return ipfsAddedFiles[0];
    } catch (err) {
      console.log(err);
    }
  }

  // Download and Decrypt a file
  /*
  hash:
  key: 
  */
  public async downloadDecryptFromIPFS(
    hash: string,
    key: string,
    fileName: string,
  ): Promise<void> {
    try {
      // Get Encrypted File Stream from IPFS hash
      const encryptedStream = await this.IPFS.getFileStream(hash);

      // Pipe encrypted stream into the decryption/unzipping/write stream
      this.Files.createDecryptAndWriteStream(encryptedStream, key, fileName);
    } catch (err) {
      console.log(err);
    }
  }

  // Download a file from your inbox using its Array index or id
  public async downloadFileFromInbox(locator: number | string, outFileName: string) {
    let file;
    try {
      // If file is located by index
      if (typeof locator === 'number') {
        file = this.Status.cleanInbox[locator];
      }
      // If file is located by string id
      else if (locator === 'string') {
        file = this.Status.cleanInbox.find(
          (payload: any) => payload.id == locator,
        );
        // If other param is passed, throw
      } else {
        throw new Error('Parameter must be a valid index or string ID');
      }
      // If file not found, throw
      if (!!!file) {
        throw new Error('File not found in inbox.');
      }
      console.log('file:', file)
      const { hash, key } = file;
      return await this.downloadDecryptFromIPFS(hash, key, outFileName);
    } catch (err) {
      throw err;
    }
  }

  // Check my messages
}
