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
exports.getMpgs = exports.placeOrder = exports.withdraw = exports.deposit = exports.balance = exports.account = exports.readPrivateKey = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const dexterity_ts_1 = __importDefault(require("@hxronetwork/dexterity-ts"));
const fs_1 = __importDefault(require("fs"));
const dexterity = dexterity_ts_1.default;
const filePath = 'config.json';
const rpc = 'https://rpc-devnet.helius.xyz/?api-key=4ba0f9cc-c6e3-4401-84c0-f2c8a822a278';
const connection = new web3_js_1.Connection(rpc, 'confirmed');
const readPrivateKey = () => {
    try {
        const data = fs_1.default.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData.privateKey.map((num) => parseInt(num));
    }
    catch (err) {
        console.log('Error reading config file.', err);
        throw err;
    }
};
exports.readPrivateKey = readPrivateKey;
const getTrg = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = fs_1.default.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        if (!jsonData.Trg) {
            const newData = fs_1.default.readFileSync(filePath, 'utf-8');
            jsonData.Trg = JSON.parse(newData).Trg;
        }
        return jsonData.Trg;
    }
    catch (err) {
        console.log('Error reading config file.', err);
        throw err;
    }
});
const getMpg = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = fs_1.default.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        if (!jsonData.Mpg) {
            const newData = fs_1.default.readFileSync(filePath, 'utf-8');
            jsonData.Mpg = JSON.parse(newData).Mpg;
        }
        return jsonData.Mpg;
    }
    catch (err) {
        console.log('Error reading config file.', err);
        throw err;
    }
});
const createTrg = () => __awaiter(void 0, void 0, void 0, function* () {
    const manifest = yield dexterity.getManifest(rpc, true, wallet);
    const trg = yield manifest.createTrg(new web3_js_1.PublicKey(MPG));
    console.log(trg.toBase58());
});
const privateKey = (0, exports.readPrivateKey)();
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(privateKey));
const wallet = new anchor_1.Wallet(keypair);
const MPG = getMpg();
const TRG = getTrg();
const mpgPubkey = new web3_js_1.PublicKey(MPG);
const PRODUCT_NAME = 'BTCUSD-PERP';
const createTrader = () => __awaiter(void 0, void 0, void 0, function* () {
    const trader = new dexterity.Trader(yield dexterity.getManifest(rpc, true, wallet), TRG);
    return trader;
});
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
    //await trader.newOrder(ProductIndex, false, price, QUOTE_SIZE) // ASK (AKA: SELL)
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
//getMpgs()
//placeOrder()
