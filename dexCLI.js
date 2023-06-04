"use strict";
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
exports.getMpgs = exports.placeOrder = exports.withdraw = exports.deposit = exports.balance = exports.account = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const dexterity_ts_1 = __importDefault(require("@hxronetwork/dexterity-ts"));
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const dexterity = dexterity_ts_1.default;
const filePath = 'config.json';
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
const readPrivateKey = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield readFileAsync(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        const privateKey = jsonData.privateKey.map((num) => parseInt(num));
        return privateKey;
    }
    catch (err) {
        console.log('Error reading config file.', err);
        throw err;
    }
});
const rpc = 'https://rpc-devnet.helius.xyz/?api-key=4ba0f9cc-c6e3-4401-84c0-f2c8a822a278';
const connection = new web3_js_1.Connection(rpc, 'confirmed');
let wallet = null; // Hold the wallet instance
const createTrader = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!wallet) {
        const privateKey = yield readPrivateKey();
        const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(privateKey));
        wallet = new anchor_1.Wallet(keypair);
    }
    const trader = new dexterity.Trader(yield dexterity.getManifest(rpc, true, wallet), TRG);
    return trader;
});
const pubkey = new web3_js_1.PublicKey('63TPYUQPs3GfftYvG2iZjo42zk3uBArjGv2GEG8ao5dG');
const MPG = new web3_js_1.PublicKey('HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB');
const mpgPubkey = new web3_js_1.PublicKey(MPG);
const TRG = new web3_js_1.PublicKey('3tK2C4pmja6mR5SRaWgtRkL1HraeEDt2eV7VrNrBED6V');
const PRODUCT_NAME = 'BTCUSD-PERP';
const account = () => __awaiter(void 0, void 0, void 0, function* () {
    const trader = yield createTrader();
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()}`);
    }));
});
exports.account = account;
const balance = () => __awaiter(void 0, void 0, void 0, function* () {
    const trader = yield createTrader();
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()}`);
    }));
});
exports.balance = balance;
const deposit = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const trader = yield createTrader();
    const n = dexterity.Fractional.New(amount, 0);
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()}`);
    }));
    yield trader.deposit(n);
    yield trader.update();
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()}`);
    }));
});
exports.deposit = deposit;
const withdraw = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const trader = yield createTrader();
    const n = dexterity.Fractional.New(amount, 0);
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `);
    }));
    yield trader.withdraw(n);
    yield trader.update();
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `);
    }));
});
exports.withdraw = withdraw;
const placeOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const trader = yield createTrader();
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `);
    }));
    let ProductIndex;
    for (const [name, { index, product }] of trader.getProducts()) {
        if (name.trim() === PRODUCT_NAME.trim()) {
            ProductIndex = index;
            break;
        }
    }
    const QUOTE_SIZE = dexterity.Fractional.New(1, 0);
    const price = dexterity.Fractional.New(27000, 0);
    yield trader.newOrder(ProductIndex, true, price, QUOTE_SIZE); // BID (AKA: BUY)
    yield trader.newOrder(ProductIndex, false, price, QUOTE_SIZE); // ASK (AKA: SELL)
    yield trader.update();
    yield trader.connect(NaN, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`BALANCE: ${trader.getCashBalance()} | OPEN ORDERS: ${(yield Promise.all(trader.getOpenOrders(PRODUCT_NAME))).length} | EXCESS MARGIN: ${trader.getExcessMargin()} | PNL: ${trader.getPnL()} `);
    }));
});
exports.placeOrder = placeOrder;
const getMpgs = () => __awaiter(void 0, void 0, void 0, function* () {
    const trader = yield createTrader();
    const mpgs = Array.from(trader.manifest.fields.mpgs.values());
    for (const { pubkey, mpg, orderbooks } of mpgs) {
        console.log(`\nMPG: ${pubkey.toBase58()}`);
        for (const [_, { index, product }] of dexterity.Manifest.GetProductsOfMPG(mpg)) {
            const meta = dexterity.productToMeta(product);
            console.log('productIndex: ', index);
            console.log('Name: ', dexterity.bytesToString(meta.name).trim());
        }
    }
});
exports.getMpgs = getMpgs;
(0, exports.getMpgs)();
