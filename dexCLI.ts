import * as web3 from '@solana/web3.js'
import dexterityTs from '@hxronetwork/dexterity-ts'
import * as bs58 from 'bs58'
import {Wallet} from '@project-serum/anchor'
const dexterity = dexterityTs

const rpc = 'https://rpc-devnet.helius.xyz/?api-key=4ba0f9cc-c6e3-4401-84c0-f2c8a822a278'
const connection = new web3.Connection(rpc, 'confirmed')

const keypair = web3.Keypair.fromSecretKey(new Uint8Array([60,189,27,225,160,219,124,225,84,6,170,60,80,77,82,30,8,195,124,209,201,106,160,75,241,24,65,31,188,163,176,96,74,235,111,27,66,117,17,54,239,0,50,35,159,151,20,29,74,31,157,136,139,13,22,202,111,198,78,41,53,52,145,167]))

const wallet = new Wallet(keypair)
const pubkey =  "63TPYUQPs3GfftYvG2iZjo42zk3uBArjGv2GEG8ao5dG"
const MPG = "HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB"
//const MPG = "HYuv5qxNmUpAVcm8u2rPCjjL2Sz5KHnVWsm56vYzZtjh"
const mpgPubkey = new web3.PublicKey(MPG)
const TRG = new web3.PublicKey("3tK2C4pmja6mR5SRaWgtRkL1HraeEDt2eV7VrNrBED6V")
const PRODUCT_NAME = 'BTCUSD-PERP';

const account = async () => {
    const manifest = await dexterity.getManifest(rpc, true, wallet)
    const trader = new dexterity.Trader(manifest, TRG)

    await trader.connect(NaN, async() => {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `)
    })
}

const deposit = async(amount: number) => {
    const manifest = await dexterity.getManifest(rpc, true, wallet)
    const trader = new dexterity.Trader(manifest, TRG)
    {/* DEPOSIT */}
    const n = dexterity.Fractional.New(amount, 0)
    await trader.connect(NaN, async() => {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `)
    })
    await trader.deposit(n)
    await trader.connect(NaN, async() => {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(await Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `)
    })
}

const createTrg = async() => {
    const manifest = await dexterity.getManifest(rpc, true, wallet)
    const trg = await manifest.createTrg(mpgPubkey)
    console.log(trg.toBase58())
}

const getTrgs = async() => {
    const manifest = await dexterity.getManifest(rpc, true, wallet)
    let TRGs: any = [];
    const trgArr = await manifest.getTRGsOfWallet(new web3.PublicKey(MPG))
    trgArr.forEach((trg: any) => {TRGs.push(trg.pubkey)})
    console.log(`\n\n\nTRGS:\n` + TRGs)
}

//createTrg()
//getTrgs()
account()
//deposit(500)