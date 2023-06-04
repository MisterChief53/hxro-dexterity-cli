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
Object.defineProperty(exports, "__esModule", { value: true });
const dexCLI_1 = require("./dexCLI");
const runCLI = () => __awaiter(void 0, void 0, void 0, function* () {
    const { manifest, trader } = yield (0, dexCLI_1.classInitializer)();
    const cli = new dexCLI_1.dexCLI(manifest, trader);
    const getArgs = () => {
        //Retrieve all command arguments except the first 2
        const args = process.argv.slice(2);
        return args;
    };
    const symbols = getArgs();
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
    //account y balance (con verbose) no recibe nada, 
    const newDeposit = (symbols) => __awaiter(void 0, void 0, void 0, function* () {
        if (symbols.length == 1) {
            yield cli.deposit(parseInt(symbols[0], 10));
        }
        else if (symbols.length == 0) {
            console.log("Not enough arguments");
        }
        else {
            console.log("Too many arguments");
        }
    });
    const newWithdrawal = (symbols) => __awaiter(void 0, void 0, void 0, function* () {
        if (symbols.length == 1) {
            yield cli.withdraw(parseInt(symbols[0], 10));
        }
        else if (symbols.length == 0) {
            console.log("Not enough arguments");
        }
        else {
            console.log("Too many arguments");
        }
    });
    const newOrder = (symbols) => __awaiter(void 0, void 0, void 0, function* () {
        if (symbols.length == 3) {
            yield cli.placeOrder(parseInt(symbols[0], 10), parseInt(symbols[1], 10), parseInt(symbols[0], 10) ? true : false);
        }
        else if (symbols.length == 0) {
            console.log("Not enough arguments");
        }
        else {
            console.log("Too many arguments");
        }
    });
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
        case 'balance' || 'b':
            yield cli.balance();
            break;
        case 'account' || 'a':
            yield cli.account();
            break;
        case 'deposit' || '-D':
            yield newDeposit(symbols.slice(1));
            break;
        case 'withdraw' || '-W':
            yield newWithdrawal(symbols.slice(1));
            break;
        case 'order' || 'o':
            yield newOrder(symbols.slice(1));
            break;
        case 'showMpg':
            yield cli.getMpgs();
            break;
        case 'cancelOrder':
            //await cancelOrder()
            break;
        default:
            console.log("Unknown argument");
            break;
    }
});
runCLI();
