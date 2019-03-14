import { Stream } from 'stream';
const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'password';
const fs = require('fs');
const zlib = require('zlib');

export class Files {
  constructor() {}

  public createEncryptedStream(inFilePath: string): any {
    const readStream = this.createReadStream(inFilePath);
    const zip = this.createZipStream();
    const encrypt = this.createEncryptStream();
    return readStream.pipe(zip).pipe(encrypt);
  }

  public createDecryptAndWriteStream(encryptedStream: any, outFilePath: string): any {
    const decrypt = this.createDecryptStream();
    const unzip = this.createUnzipStream();
    const write = this.createWriteStream(outFilePath);
    return encryptedStream.pipe(decrypt).pipe(unzip).pipe(write);
  }

  // Encrypt File
  private createEncryptStream = () => {
    return crypto.createCipher(algorithm, password);
  };

  // Decrypt File
  private createDecryptStream = () => {
    return crypto.createDecipher(algorithm, password);
  };

  // Readfile as stream and pipe
  private createReadStream = (filePath: string) => {
    return fs.createReadStream(filePath);
  };

  // Writefile as a stream
  public createWriteStream = (filePath: string) => {
    return fs.createWriteStream(filePath);
  };

  // Zip File
  private createZipStream = () => {
    return zlib.createGzip();
  };

   // Unzip File
   private createUnzipStream = () => {
    return zlib.createGunzip();
  };


  // Test
  public doTheThing = (inFilePath: string, outFilePath: string) => {
    // input file
    var r = fs.createReadStream(inFilePath);
    // zip content
    var zip = zlib.createGzip();
    // encrypt content
    var encrypt = crypto.createCipher(algorithm, password);
    // decrypt content
    var decrypt = crypto.createDecipher(algorithm, password);
    // unzip content
    var unzip = zlib.createGunzip();
    // write file
    var w = fs.createWriteStream(outFilePath);

    // start pipe
    r.pipe(zip)
      .pipe(encrypt)
      .pipe(decrypt)
      .pipe(unzip)
      .pipe(w);
  };
}
