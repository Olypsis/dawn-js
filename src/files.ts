import { Stream } from 'stream';
const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'password';
const fs = require('fs');
const zlib = require('zlib');
const progress = require('progress-stream');

export class Files {

  public currentFileSize : number = 0;

  constructor() {}

  public createEncryptedStream(inFilePath: string): any {
    const stats = fs.statSync(inFilePath);
    this.currentFileSize = stats.size;
    const progressStream = this.createProgressStream(this.currentFileSize, "encrypt");
    const readStream = this.createReadStream(inFilePath);
    const zip = this.createZipStream();
    const encrypt = this.createEncryptStream();
    return readStream.pipe(zip).pipe(encrypt).pipe(progressStream);
  }

  public createDecryptAndWriteStream(encryptedStream: any, outFilePath: string): any {
    const decrypt = this.createDecryptStream();
    const progressStream = this.createProgressStream(this.currentFileSize, "decrypt");
    const unzip = this.createUnzipStream();
    const write = this.createWriteStream(outFilePath);
    return encryptedStream.pipe(decrypt).pipe(unzip).pipe(progressStream).pipe(write);
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

  private createProgressStream = (fileSize: number, flag: string) => {
    const progressStream = progress({
        length: fileSize,
        time: 100 /* ms */
    });

    progressStream.on('progress', function(progress: any) {
        console.log(flag + ": " + progress.percentage);
        /*
        {
            percentage: 9.05,
            transferred: 949624,
            length: 10485760,
            remaining: 9536136,
            eta: 42,
            runtime: 3,
            delta: 295396,
            speed: 949624
        }
        */
    });

    return progressStream;
  }


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
