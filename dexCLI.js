"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3 = __importStar(require("@solana/web3.js"));
const dexterity_ts_1 = __importDefault(require("@hxronetwork/dexterity-ts"));
const anchor_1 = require("@project-serum/anchor");
const dexterity = dexterity_ts_1.default;
const rpc = 'https://rpc-devnet.helius.xyz/?api-key=4ba0f9cc-c6e3-4401-84c0-f2c8a822a278';
const connection = new web3.Connection(rpc, 'confirmed');
const keypair = web3.Keypair.fromSecretKey(new Uint8Array([60, 189, 27, 225, 160, 219, 124, 225, 84, 6, 170, 60, 80, 77, 82, 30, 8, 195, 124, 209, 201, 106, 160, 75, 241, 24, 65, 31, 188, 163, 176, 96, 74, 235, 111, 27, 66, 117, 17, 54, 239, 0, 50, 35, 159, 151, 20, 29, 74, 31, 157, 136, 139, 13, 22, 202, 111, 198, 78, 41, 53, 52, 145, 167]));
const wallet = new anchor_1.Wallet(keypair);
const pubkey = "63TPYUQPs3GfftYvG2iZjo42zk3uBArjGv2GEG8ao5dG";
const MPG = "HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB";
//const MPG = "HYuv5qxNmUpAVcm8u2rPCjjL2Sz5KHnVWsm56vYzZtjh"
const mpgPubkey = new web3.PublicKey(MPG);
const TRG = new web3.PublicKey("3tK2C4pmja6mR5SRaWgtRkL1HraeEDt2eV7VrNrBED6V");
const PRODUCT_NAME = 'BTCUSD-PERP';
const account = () => __awaiter(void 0, void 0, void 0, function* () {
    const manifest = yield dexterity.getManifest(rpc, true, wallet);
    const trader = new dexterity.Trader(manifest, TRG);
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `);
    }));
});
const deposit = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const manifest = yield dexterity.getManifest(rpc, true, wallet);
    const trader = new dexterity.Trader(manifest, TRG);
    { /* DEPOSIT */ }
    const n = dexterity.Fractional.New(amount, 0);
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `);
    }));
    yield trader.deposit(n);
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `);
    }));
});
const createTrg = () => __awaiter(void 0, void 0, void 0, function* () {
    const manifest = yield dexterity.getManifest(rpc, true, wallet);
    const trg = yield manifest.createTrg(mpgPubkey);
    console.log(trg.toBase58());
});
const getTrgs = () => __awaiter(void 0, void 0, void 0, function* () {
    const manifest = yield dexterity.getManifest(rpc, true, wallet);
    let TRGs = [];
    const trgArr = yield manifest.getTRGsOfWallet(new web3.PublicKey(MPG));
    trgArr.forEach((trg) => { TRGs.push(trg.pubkey); });
    console.log(`\n\n\nTRGS:\n` + TRGs);
});
//createTrg()
//getTrgs()
account();
//deposit(500)
