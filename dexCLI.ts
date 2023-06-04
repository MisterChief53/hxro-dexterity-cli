import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';
import dexterityTs from '@hxronetwork/dexterity-ts';
import fs from 'fs';

const dexterity = dexterityTs;
const filePath = 'config.json';

const rpc = 'https://rpc-devnet.helius.xyz/?api-key=4ba0f9cc-c6e3-4401-84c0-f2c8a822a278';
const connection = new Connection(rpc, 'confirmed');

export const readPrivateKey = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(data)
    return jsonData.privateKey.map((num: any) => parseInt(num))
  } catch (err) {
    console.log('Error reading config file.', err);
    throw err;
  }
}

const getTrg = async () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);

    if (!jsonData.Trg) {
      const newData = fs.readFileSync(filePath, 'utf-8');
      jsonData.Trg = JSON.parse(newData).Trg;
    }

    return jsonData.Trg

  } catch (err) {
    console.log('Error reading config file.', err);
    throw err;
  }
}

const getMpg = async () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);

    if (!jsonData.Mpg) {
      const newData = fs.readFileSync(filePath, 'utf-8');
      jsonData.Mpg = JSON.parse(newData).Mpg;
    }

    return jsonData.Mpg

  } catch (err) {
    console.log('Error reading config file.', err);
    throw err;
  }
}

const createTrg = async() => {
  const manifest = await dexterity.getManifest(rpc, true, wallet)
  const trg = await manifest.createTrg(new PublicKey(MPG))
  console.log(trg.toBase58())
}

const privateKey = readPrivateKey()
const keypair = Keypair.fromSecretKey(new Uint8Array(privateKey));
const wallet = new Wallet(keypair);

const MPG = getMpg()
const TRG = getTrg()

const mpgPubkey = new PublicKey(MPG);
const PRODUCT_NAME = 'BTCUSD-PERP';

const createTrader = async () => {
  const trader = new dexterity.Trader(await dexterity.getManifest(rpc, true, wallet), TRG);
  return trader;
};

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

  await trader.newOrder(ProductIndex, true, price, QUOTE_SIZE) // BID (AKA: BUY)
  //await trader.newOrder(ProductIndex, false, price, QUOTE_SIZE) // ASK (AKA: SELL)

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
//placeOrder()