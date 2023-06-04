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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const dexterity_ts_1 = __importDefault(require("@hxronetwork/dexterity-ts"));
const dexterity = dexterity_ts_1.default;
const web3 = __importStar(require("@solana/web3.js"));
const fs = __importStar(require("fs"));
const CLUSTER_NAME = "devnet";
const rpc = (0, web3_js_1.clusterApiUrl)(CLUSTER_NAME);
var keypair = "default";
const filePath = 'config.json';
let privateKey = [];
fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading config file:', err);
        return;
    }
    const jsonData = JSON.parse(data);
    if (Array.isArray(jsonData.privateKey)) {
        privateKey = jsonData.privateKey.map((num) => parseInt(num));
        console.log(privateKey);
        const keypair = web3.Keypair.fromSecretKey(new Uint8Array(privateKey));
        const wallet = new anchor_1.Wallet(keypair);
        const MPG = "DDxNzq3A4qKJxnK2PFYeXE1SgGXCR5baaDBhpfLn3LRS";
        const mpgPubkey = new web3_js_1.PublicKey(MPG);
        const getArgs = () => {
            //Retrieve all command arguments except the first 2
            const args = process.argv.slice(2);
            return args;
        };
        const printCommandHelp = () => {
            const help = `
      This is a dexterity CLI app, aiming to help you bee speedier with your transactions
      and general dexterity tasks!
      
      command - description

      --help - see the help screen, which lists all commands and their usage.

      createPoem - Create a poem. Usage: "createPoem {title}". 
      Optional arguments are: "--subject {subject}" and "--villain {villain} as 
      arguments. They can be in any order, and will be replaced by a default value
      if not specified.
      `;
            console.log(help);
        };
        const createPoem = (symbols) => {
            var subject = 'john';
            var villain = 'johnny';
            var title = 'favorite poem';
            symbols.forEach((symbol, index) => {
                if (symbol == '--subject') {
                    if (index < symbols.length - 1) {
                        subject = symbols[index + 1];
                    }
                    else {
                        console.log(`The ${symbol} command needs an argument.`);
                    }
                }
                else if (symbol == '--villain') {
                    if (index < symbols.length - 1) {
                        villain = symbols[index + 1];
                    }
                    else {
                        console.log(`The ${symbol} command needs an argument.`);
                    }
                }
                else if (index == 0) {
                    title = symbol;
                }
            });
            const poem = `
      This poem is titled ${title}.

      The subject is ${subject} ,
      and the villain is ${villain}.
      `;
            console.log(poem);
        };
        const printKeys = () => {
            const filePath = 'config.json';
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error('Error reading config file:', err);
                    return;
                }
                const jsonData = JSON.parse(data);
                jsonData.field1 = 'Updated Value 1' + 'concat';
                jsonData.field2 += 100;
                const updatedJsonString = JSON.stringify(jsonData, null, 2);
                fs.writeFile(filePath, updatedJsonString, 'utf-8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('JSON data has been written to the file');
                });
            });
        };
        const symbols = getArgs();
        if (symbols.length === 0) {
            printCommandHelp();
            process.exit(0);
        }
        switch (symbols[0]) {
            case '--help':
                printCommandHelp();
                break;
            case 'createPoem':
                createPoem(symbols.slice(1));
                break;
            case 'printKeys':
                printKeys();
                break;
        }
        /*
        const CreateTRG = async() => {
          
            // get the latest manifest
            const manifest = await dexterity.getManifest(rpc, false, wallet);
    
            //Create our TRG for the BTC-USD MPG
            const trgPubkey = await manifest.createTrg(mpgPubkey);
            console.log("success! trg pubkey:", trgPubkey.toBase58());
          }
          
          CreateTRG()
        */
    }
});
