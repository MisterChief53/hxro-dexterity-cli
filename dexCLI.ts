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
    const trader = new dexterity.Trader(manifest, new PublicKey(trg[0].pubkey))
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
      console.log(`Depositing ${amount}...`)
    });

    await this.trader.deposit(n)
    await this.trader.update()
    await this.trader.connect(NaN, async () => {
      console.log(`\n---------------\nDeposit Succesful!\nNew Balance: ${this.trader.getCashBalance()}\n---------------\n`);
    });
  };

  async withdraw (amount: number) {
    const n = dexterity.Fractional.New(amount, 0);

    await this.trader.connect(NaN, async () => {
      console.log(`Withdrawing ${amount}...`)
    });

    await this.trader.withdraw(n)
    await this.trader.update()
    await this.trader.connect(NaN, async () => {
      console.log(`\n---------------\nWithdrawal Succesful!\nNew Balance: ${this.trader.getCashBalance()}\n---------------\n`);
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
      console.log('---------------\nAccount Info:\nBALANCE: ' + balance + 
                  '\nEXCESS MARGIN: ' + excess + 
                  '\nPORTFOLIO VALUE: ' + totalPortfolio + 
                  '\nACTIVE POSITION VALUE: ' + positionValue + 
                  '\nACTIVE: ' + active + 
                  '\nOPEN ORDERS: ' + openOrders + 
                  '\nPNL: ' + pnl + '\n---------------\n')
    })
  };

  async balance () {
    await this.trader.connect(NaN, async () => {
      console.log(`\n---------------\nCurrent Balance: ${this.trader.getCashBalance()}\n---------------\n`);
    });
  };

  async placeOrder (size: number, price: number, isBid: boolean) {
    await this.trader.connect(NaN, async () => {
        console.log('Placing ' + price*size + ' limit in [' + this.PRODUCT_NAME + '] -> ' + (isBid ? "Buy" : "Sell"))
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
  
    this.trader.newOrder(ProductIndex, isBid, limitPrice, QUOTE_SIZE).then(async () => {
      console.log(`Placed ${(isBid?"Buy":"Sell")} Limit Order at $${limitPrice}`);
    })
  
    await this.trader.update()
    await this.account()
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

  async cancelOrder () {

    const orders = await Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME));

    if (orders.length === 0) {
        console.log('CancelAllOrders Failed: Sorry there are no open orders on this account')
        return
    }

    this.trader.cancelAllOrders(this.PRODUCT_NAME, true);

    console.log(`Canceled all orders`);
  };
}

const start = async() => {

  const {manifest, trader} = await classInitializer()
  const cli = new dexCLI(manifest, trader)

  //await cli.account()
  //await cli.deposit(1000)
  //await cli.withdraw(100)
  //await cli.placeOrder(1, 1_000, true)
  await cli.cancelOrder()
}

start()