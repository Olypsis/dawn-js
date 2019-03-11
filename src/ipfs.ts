const _IPFS = require('ipfs');

export class IPFS {
  public node: any;
  public version?: string;
  public id?: string;

  //IPFS is completely setup in its constructor
  constructor() {
    this.node = new _IPFS();

    this.node.on('ready', async () => {
      const version = await this.node.version();
      const id = await this.node.id();
      this.version = version.version;
      this.id = id.id;

      console.log(`IPFS Node Ready:
        Version: ${version.version}
        Node Id: ${id.id}
      `);
    });
  }
}
