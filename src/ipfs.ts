const _IPFS = require('ipfs');

export class IPFS {
  public node: any;
  public version?: string;
  public id?: string;
  private isNodeReady: boolean = false;

  //IPFS is completely setup in its constructor
  constructor() {
    this.node = new _IPFS();

    this.node.on('ready', async () => {
      const version = await this.node.version();
      const id = await this.node.id();
      this.version = version.version;
      this.id = id.id;
      this.isNodeReady = true;

      console.log(`IPFS Node Ready:
        Version: ${version.version}
        Node Id: ${id.id}
      `);
    });
  }

  // Add file to IPFS : input should be an encrypted file buffer
  public addFile = async (buffer: any, fileName: string): Promise<object> => {
    const { node } = this;
    return new Promise(async (resolve, reject) => {
      try {
        const filesAdded = await node.add({
          content: buffer, // A Buffer, Readable Stream or Pull Stream with the contents of the file
          path: fileName, // The file path
        });
        const { hash, path } = filesAdded[0];
        resolve({ hash, path });
      } catch (err) {
        reject(err);
      }
    });
  };

  // Get File from IPFS
  // FIXME: Path should return filename and not cid
  public getFile = async (hash: string): Promise<object> => {
    const { node } = this;
    return new Promise(async (resolve, reject) => {
      try {
        const files = await node.get(hash);
        const res = files.map((file: any) => {
          const { content, path } = file;
          return { content, path };
        });
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  };

  // Pin file to node on IPFS - returns pinset
  public pinAdd = async (hash: string): Promise<object> => {
    const { node } = this;
    return new Promise(async (resolve, reject) => {
      try {
        const pinset = await node.pin.add(hash);
        resolve(pinset);
      } catch (err) {
        reject(err);
      }
    });
  };

  // Pin file to node on IPFS - returns pinset
  public pinLs = async (hash: string): Promise<object> => {
    const { node } = this;
    return new Promise(async (resolve, reject) => {
      try {
        const pinset = await node.pin.ls();
        resolve(pinset);
      } catch (err) {
        reject(err);
      }
    });
  };

  private checkNodeReady(fn?: any) {
    if (this.isNodeReady == false) {
      setTimeout(
        this.checkNodeReady,
        100,
      ); /* this checks the flag every 100 milliseconds*/
    } else {
      return true;
    }
  }
}