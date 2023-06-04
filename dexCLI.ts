import { Keypair, PublicKey } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';
import dexterityTs, {Manifest, Trader} from '@hxronetwork/dexterity-ts';
import { promisify } from 'util';
import fs from 'fs';

const dexterity = dexterityTs;
const filePath = 'config.json';
const readFileAsync = promisify(fs.readFile);

const readPrivateKey = async () => {
  try {
    const data = await readFileAsync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const privateKey = jsonData.privateKey.map((num: any) => parseInt(num));
    return privateKey;
  } catch (err) {
    console.log('Error reading config file.', err);
    throw err;
  }
};

const rpc = 'https://rpc-devnet.helius.xyz/?api-key=4ba0f9cc-c6e3-4401-84c0-f2c8a822a278';

export const classInitializer = async () => {
  const privateKey = await readPrivateKey();
  const keypair = Keypair.fromSecretKey(new Uint8Array(privateKey));
  const wallet = new Wallet(keypair);

  const MPG = new PublicKey('HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB')

  const manifest = await dexterity.getManifest(rpc, true, wallet)

  // Validate TRG
  const trg = Array.from(await manifest.getTRGsOfWallet(MPG))
  if (trg.length > 0) {
    const trader = new dexterity.Trader(manifest, trg[0])
    return {manifest, trader}
  } else {
    const TRG = await manifest.createTrg(MPG)
    const trader = new dexterity.Trader(manifest, TRG)
    return {manifest, trader}
  }
};

export class dexCLI {
  private manifest: InstanceType<typeof Manifest>;
  private trader: InstanceType<typeof Trader>;
  private PRODUCT_NAME: string

  constructor(manifest: InstanceType<typeof Manifest>, trader: InstanceType<typeof Trader>) {
    this.manifest = manifest
    this.trader = trader
    this.PRODUCT_NAME = 'BTCUSD-PERP'
  }

  async deposit (amount: number) {
    const n = dexterity.Fractional.New(amount, 0);
    await this.trader.connect(NaN, async () => {
      console.log(
        `BALANCE: ${this.trader.getCashBalance()} | OPEN ORDERS: ${
          (await Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME))).length
        } | EXCESS MARGIN: ${this.trader.getExcessMargin()} | PNL: ${this.trader.getPnL()}`
      );
    });
    await this.trader.deposit(n)
    await this.trader.update()
    await this.trader.connect(NaN, async () => {
      console.log(
        `BALANCE: ${this.trader.getCashBalance()} | OPEN ORDERS: ${
          (await Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME))).length
        } | EXCESS MARGIN: ${this.trader.getExcessMargin()} | PNL: ${this.trader.getPnL()}`
      );
    });
  };

  async withdraw (amount: number) {
    const n = dexterity.Fractional.New(amount, 0);
    await this.trader.connect(NaN, async () => {
      console.log(
        `BALANCE: ${this.trader.getCashBalance()} | OPEN ORDERS: ${
          (await Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME))).length
        } | EXCESS MARGIN: ${this.trader.getExcessMargin()} | PNL: ${this.trader.getPnL()}`
      );
    });
    await this.trader.withdraw(n)
    await this.trader.update()
    await this.trader.connect(NaN, async () => {
      console.log(
        `BALANCE: ${this.trader.getCashBalance()} | OPEN ORDERS: ${
          (await Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME))).length
        } | EXCESS MARGIN: ${this.trader.getExcessMargin()} | PNL: ${this.trader.getPnL()}`
      );
    });
  };

  async account () {
    await this.trader.connect(NaN, async() => {
      const balance = this.trader.getCashBalance()
      const excess = this.trader.getExcessMargin()
      const totalPortfolio = this.trader.getPortfolioValue()
      const positionValue = this.trader.getPositionValue()
      const pnl = this.trader.getPnL()
      const active = (await Promise.all(this.trader.getPositions())).length
      const openOrders = (await Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME))).length
      console.log('\nBALANCE: ' + balance + 
                  '\nEXCESS MARGIN: ' + excess + 
                  '\nPORTFOLIO VALUE: ' + totalPortfolio + 
                  '\nACTIVE POSITION VALUE: ' + positionValue + 
                  '\nACTIVE: ' + active + 
                  '\nOPEN ORDERS: ' + openOrders + 
                  '\nPNL: ' + pnl)
    })
  };

  async balance () {
    await this.trader.connect(NaN, async () => {
      console.log(`BALANCE: ${this.trader.getCashBalance()}`);
    });
  };

  async placeOrder (size: number, price: number, isBid: boolean) {
  
    await this.trader.connect(NaN, async () => {
        console.log(`BALANCE: ${this.trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME))).length} | EXCESS MARGIN: ${this.trader.getExcessMargin()} | PNL: ${this.trader.getPnL()} `)
    })
  
    let ProductIndex: any
    for (const [name, { index, product }] of this.trader.getProducts()) {
        if (name.trim() === this.PRODUCT_NAME.trim()) {
            ProductIndex = index
            break
        }
    }
  
    const QUOTE_SIZE = dexterity.Fractional.New(size, 0);
  
    const limitPrice = dexterity.Fractional.New(price, 0)
  
    await this.trader.newOrder(ProductIndex, isBid, limitPrice, QUOTE_SIZE)
  
    await this.trader.update()
    await this.trader.connect(NaN, async () => {
        console.log(`BALANCE: ${this.trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME))).length} | EXCESS MARGIN: ${this.trader.getExcessMargin()} | PNL: ${this.trader.getPnL()} `)
    })
  }

  async getMpgs () {
    const mpgs = Array.from(this.trader.manifest.fields.mpgs.values());
  
    for (const { pubkey, mpg, orderbooks } of mpgs) {
        console.log(`\nMPG: ${pubkey.toBase58()}`)
      for (const [_, { index, product }] of dexterity.Manifest.GetProductsOfMPG(mpg,)) {
        const meta = dexterity.productToMeta(product);
          console.log('productIndex: ', index);
          console.log('Name: ', dexterity.bytesToString(meta.name).trim());
      }
    }
  };
}

const start = async() => {

  const {manifest, trader} = await classInitializer()
  const cli = new dexCLI(manifest, trader)

  cli.account()
}

start()