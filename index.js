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
const fs_1 = __importDefault(require("fs"));
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
    const newDeposit = (symbols) => {
        if (symbols.length == 1) {
            cli.deposit(parseInt(symbols[0], 10));
            console.log("Deposit succesful");
        }
        else if (symbols.length == 0) {
            console.log("Not enough arguments");
        }
        else {
            console.log("Too many arguments");
        }
    };
    const newWithdrawal = (symbols) => {
        if (symbols.length == 1) {
            cli.withdraw(parseInt(symbols[0], 10));
            console.log("Withdrawal succesful");
        }
        else if (symbols.length == 0) {
            console.log("Not enough arguments");
        }
        else {
            console.log("Too many arguments");
        }
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
        fs_1.default.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading config file:', err);
                return;
            }
            const jsonData = JSON.parse(data);
            jsonData.field1 = 'Updated Value 1' + 'concat';
            jsonData.field2 += 100;
            const updatedJsonString = JSON.stringify(jsonData, null, 2);
            fs_1.default.writeFile(filePath, updatedJsonString, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON data has been written to the file');
            });
        });
    };
    if (symbols.length === 0) {
        //printCommandHelp();
        yield cli.account();
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
        case 'balance':
            yield cli.balance();
            break;
        case 'account':
            yield cli.account();
            break;
        case 'deposit':
            yield newDeposit(symbols.slice(1));
            break;
        case 'withdraw':
            yield newWithdrawal(symbols.slice(1));
            break;
        default:
            console.log("Unknown argument");
            break;
    }
});
runCLI();
