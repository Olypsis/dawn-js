import { Stream } from 'stream';
const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');
const progress = require('progress-stream');

const algorithm = 'aes-256-ctr';
const password = 'password';

export class Files {
  public currentFileSize: number = 0;

  public async createEncryptedStream(inFilePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const stats = fs.statSync(inFilePath);
        this.currentFileSize = stats.size;
        const readStream = this.createReadStream(inFilePath);
        const zip = this.createZipStream();
        const encrypt = this.createEncryptStream();
        const progressStream = this.createProgressStream('encrypt');
        resolve(
          readStream
            .pipe(zip)
            .pipe(encrypt)
            .pipe(progressStream),
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  public createDecryptAndWriteStream(
    encryptedStream: any,
    outFilePath: string,
    key: string
  ): any {
    const decrypt = this.createDecryptStream();
    const unzip = this.createUnzipStream();
    const progressStream = this.createProgressStream('decrypt');
    const write = this.createWriteStream(outFilePath);

    return encryptedStream
      .pipe(decrypt)
      .pipe(unzip)
      .pipe(progressStream)
      .pipe(write);
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

  // Write file as a stream. Once finished, output to console. 
  public createWriteStream = (filePath: string) => {
    const stream = fs.createWriteStream(filePath);
    // On stream close, output to console
    stream.on('finish', () => { console.log(`File written to ${filePath}`) })
    return stream
  };

  // Zip File
  private createZipStream = () => {
    return zlib.createGzip();
  };

  // Unzip File
  private createUnzipStream = () => {
    return zlib.createGunzip();
  };

  private createProgressStream = (flag: string) => {
    const progressStream = progress({
      length: this.currentFileSize,
      time: 100 /* ms */,
    });

    progressStream.on('progress', function(progress: any) {
      console.log(flag + ': ' + progress.percentage);
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
