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

  // Add file to IPFS
  public addFile = async (buffer: any, fileName: string): Promise<object> => {
    const { node } = this;
    return new Promise(async (resolve, reject) => {
      try {
        const filesAdded = await node.add({
          content: buffer,
          path: fileName,
        });
        const { hash, path } = filesAdded[0];
        console.log('Added file:', path, hash);
        resolve({ hash, path });
      } catch (err) {
        reject(err);
      }
    });
  };

  private checkNodeReady(fn?: any) {
    if(this.isNodeReady == false) {
       setTimeout(this.checkNodeReady, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      return true;
    }
}
}
