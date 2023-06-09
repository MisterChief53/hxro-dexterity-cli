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
exports.dexCLI = exports.classInitializer = void 0;
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
const classInitializer = () => __awaiter(void 0, void 0, void 0, function* () {
    const privateKey = yield readPrivateKey();
    const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(privateKey));
    const wallet = new anchor_1.Wallet(keypair);
    const MPG = new web3_js_1.PublicKey('HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB');
    const manifest = yield dexterity.getManifest(rpc, true, wallet);
    // Validate TRG
    const trg = Array.from(yield manifest.getTRGsOfWallet(MPG));
    if (trg.length > 0) {
        const trader = new dexterity.Trader(manifest, new web3_js_1.PublicKey(trg[0].pubkey));
        return { manifest, trader };
    }
    else {
        const TRG = yield manifest.createTrg(MPG);
        const trader = new dexterity.Trader(manifest, TRG);
        return { manifest, trader };
    }
});
exports.classInitializer = classInitializer;
class dexCLI {
    constructor(manifest, trader) {
        this.manifest = manifest;
        this.trader = trader;
        this.PRODUCT_NAME = 'BTCUSD-PERP';
    }
    deposit(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const n = dexterity.Fractional.New(amount, 0);
            yield this.trader.connect(NaN, () => __awaiter(this, void 0, void 0, function* () {
                console.log(`Depositing ${amount}...`);
            }));
            yield this.trader.deposit(n);
            yield this.trader.update();
            yield this.trader.connect(NaN, () => __awaiter(this, void 0, void 0, function* () {
                console.log(`\n---------------\nDeposit Succesful!\nNew Balance: ${this.trader.getCashBalance()}\n---------------\n`);
            }));
        });
    }
    ;
    withdraw(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const n = dexterity.Fractional.New(amount, 0);
            yield this.trader.connect(NaN, () => __awaiter(this, void 0, void 0, function* () {
                console.log(`Withdrawing ${amount}...`);
            }));
            yield this.trader.withdraw(n);
            yield this.trader.update();
            yield this.trader.connect(NaN, () => __awaiter(this, void 0, void 0, function* () {
                console.log(`\n---------------\nWithdrawal Succesful!\nNew Balance: ${this.trader.getCashBalance()}\n---------------\n`);
            }));
        });
    }
    ;
    account() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.trader.connect(NaN, () => __awaiter(this, void 0, void 0, function* () {
                const balance = this.trader.getCashBalance();
                const excess = this.trader.getExcessMargin();
                const totalPortfolio = this.trader.getPortfolioValue();
                const positionValue = this.trader.getPositionValue();
                const pnl = this.trader.getPnL();
                const active = (yield Promise.all(this.trader.getPositions())).length;
                const openOrders = (yield Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME))).length;
                console.log('---------------\nAccount Info:\nBALANCE: ' + balance +
                    '\nEXCESS MARGIN: ' + excess +
                    '\nPORTFOLIO VALUE: ' + totalPortfolio +
                    '\nACTIVE POSITION VALUE: ' + positionValue +
                    '\nACTIVE: ' + active +
                    '\nOPEN ORDERS: ' + openOrders +
                    '\nPNL: ' + pnl + '\n---------------\n');
            }));
        });
    }
    ;
    balance() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.trader.connect(NaN, () => __awaiter(this, void 0, void 0, function* () {
                console.log(`\n---------------\nCurrent Balance: ${this.trader.getCashBalance()}\n---------------\n`);
            }));
        });
    }
    ;
    placeOrder(size, price, isBid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.trader.connect(NaN, () => __awaiter(this, void 0, void 0, function* () {
                console.log('Placing ' + price * size + ' limit in [' + this.PRODUCT_NAME + '] -> ' + (isBid ? "Buy" : "Sell"));
            }));
            let ProductIndex;
            for (const [name, { index, product }] of this.trader.getProducts()) {
                if (name.trim() === this.PRODUCT_NAME.trim()) {
                    ProductIndex = index;
                    break;
                }
            }
            const QUOTE_SIZE = dexterity.Fractional.New(size, 0);
            const limitPrice = dexterity.Fractional.New(price, 0);
            this.trader.newOrder(ProductIndex, isBid, limitPrice, QUOTE_SIZE).then(() => __awaiter(this, void 0, void 0, function* () {
                console.log(`Placed ${(isBid ? "Buy" : "Sell")} Limit Order at $${limitPrice}`);
            }));
            yield this.trader.update();
            yield this.account();
        });
    }
    getMpgs() {
        return __awaiter(this, void 0, void 0, function* () {
            const mpgs = Array.from(this.trader.manifest.fields.mpgs.values());
            for (const { pubkey, mpg, orderbooks } of mpgs) {
                console.log(`\nMPG: ${pubkey.toBase58()}`);
                for (const [_, { index, product }] of dexterity.Manifest.GetProductsOfMPG(mpg)) {
                    const meta = dexterity.productToMeta(product);
                    console.log('productIndex: ', index);
                    console.log('Name: ', dexterity.bytesToString(meta.name).trim());
                }
            }
        });
    }
    ;
    cancelOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield Promise.all(this.trader.getOpenOrders(this.PRODUCT_NAME));
            if (orders.length === 0) {
                console.log('CancelAllOrders Failed: Sorry there are no open orders on this account');
                return;
            }
            this.trader.cancelAllOrders(this.PRODUCT_NAME, true);
            console.log(`Canceled all orders`);
        });
    }
    ;
}
exports.dexCLI = dexCLI;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const { manifest, trader } = yield (0, exports.classInitializer)();
    const cli = new dexCLI(manifest, trader);
    //await cli.account()
    //await cli.deposit(1000)
    //await cli.withdraw(100)
    //await cli.placeOrder(1, 1_000, true)
    yield cli.cancelOrder();
});
start();
