import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';
import dexterityTs from '@hxronetwork/dexterity-ts';
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
const connection = new Connection(rpc, 'confirmed');

let wallet: Wallet | null = null; // Hold the wallet instance

const createTrader = async () => {
  if (!wallet) {
    const privateKey = await readPrivateKey();
    const keypair = Keypair.fromSecretKey(new Uint8Array(privateKey));
    wallet = new Wallet(keypair);
  }

  const trader = new dexterity.Trader(await dexterity.getManifest(rpc, true, wallet), TRG);
  return trader;
};

const pubkey = new PublicKey('63TPYUQPs3GfftYvG2iZjo42zk3uBArjGv2GEG8ao5dG');
const MPG = new PublicKey('HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB');
const mpgPubkey = new PublicKey(MPG);
const TRG = new PublicKey('3tK2C4pmja6mR5SRaWgtRkL1HraeEDt2eV7VrNrBED6V');
const PRODUCT_NAME = 'BTCUSD-PERP';

export const account = async () => {
  const trader = await createTrader();

  await trader.connect(NaN, async () => {
    console.log(
      `BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${
        (await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length
      } | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()}`
    );
  });
};

export const balance = async () => {
  const trader = await createTrader();

  await trader.connect(NaN, async () => {
    console.log(`BALANCE: ${trader.getCashBalance()}`);
  });
};

export const deposit = async (amount: number) => {
  const trader = await createTrader();

  const n = dexterity.Fractional.New(amount, 0);
  await trader.connect(NaN, async () => {
    console.log(
      `BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${
        (await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length
      } | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()}`
    );
  });
  await trader.deposit(n)
  await trader.update()
  await trader.connect(NaN, async () => {
    console.log(
      `BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${
        (await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length
      } | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()}`
    );
  });
};

export const withdraw = async (amount: number) => {
    const trader = await createTrader();

    const n = dexterity.Fractional.New(amount, 0)

    await trader.connect(NaN, async () => {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `)
    })

    await trader.withdraw(n)
    await trader.update()
    await trader.connect(NaN, async () => {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `)
    })
}

export const placeOrder = async () => {
  const trader = await createTrader();

  await trader.connect(NaN, async () => {
      console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `)
  })

  let ProductIndex: any
  for (const [name, { index, product }] of trader.getProducts()) {
      if (name.trim() === PRODUCT_NAME.trim()) {
          ProductIndex = index
          break
      }
  }

  const QUOTE_SIZE = dexterity.Fractional.New(1, 0);

  const price = dexterity.Fractional.New(27_000, 0)

  //await trader.newOrder(ProductIndex, true, price, QUOTE_SIZE) // BID (AKA: BUY)
  await trader.newOrder(ProductIndex, false, price, QUOTE_SIZE) // ASK (AKA: SELL)

  await trader.update()
  await trader.connect(NaN, async () => {
      console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `)
  })
}

export const getMpgs = async () => {
  const trader = await createTrader()
  const mpgs = Array.from(trader.manifest.fields.mpgs.values());

  for (const { pubkey, mpg, orderbooks } of mpgs) {
      console.log(`\nMPG: ${pubkey.toBase58()}`)
    for (const [_, { index, product }] of dexterity.Manifest.GetProductsOfMPG(mpg,)) {
      const meta = dexterity.productToMeta(product);
        console.log('productIndex: ', index);
        console.log('Name: ', dexterity.bytesToString(meta.name).trim());
    }
  }
};

//getMpgs()
placeOrder()