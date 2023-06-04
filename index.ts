import fs from 'fs'
import { classInitializer, dexCLI } from "./dexCLI";

const runCLI = async () => {
  const {manifest, trader} = await classInitializer()
  const cli = new dexCLI(manifest, trader)

  const getArgs = () => {
    //Retrieve all command arguments except the first 2
    const args = process.argv.slice(2);
    return args
  }

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
    `
    console.log(help);
  }
  //account y balance (con verbose) no recibe nada, 
  
  const newDeposit = async (symbols: string[]) => {
    if(symbols.length == 1){
      await cli.deposit(parseInt(symbols[0],10));
    }else if(symbols.length == 0){
      console.log("Not enough arguments");
    }else{
      console.log("Too many arguments");
    }
  }
  
  const newWithdrawal = async (symbols: string[]) => {
    if(symbols.length == 1){
      await cli.withdraw(parseInt(symbols[0],10));
    }else if(symbols.length == 0){
      console.log("Not enough arguments");
    }else{
      console.log("Too many arguments");
    }
  }
  
  const newOrder = async (symbols: string[]) => { // 1 4 4
    if(symbols.length == 3){
      await cli.placeOrder(parseInt(symbols[0],10), parseInt(symbols[1],10), parseInt(symbols[0],10)?true:false);
    }else if(symbols.length == 0){
      console.log("Not enough arguments");
    }else{
      console.log("Too many arguments");
    }
  } 
  
  const createPoem = (symbols: string[]) => {
    var subject = 'john';
    var villain = 'johnny';
    var title = 'favorite poem';
    symbols.forEach((symbol, index) =>{
  
      if(symbol == '--subject'){
        if(index < symbols.length -1){
          subject = symbols[index +1];
        }else{
          console.log(`The ${symbol} command needs an argument.`)
        }
      }else if(symbol == '--villain'){
        if(index < symbols.length -1){
          villain = symbols[index +1];
        }else{
          console.log(`The ${symbol} command needs an argument.`)
        }
      }else if(index == 0){  
        title = symbol;
      }
    })
  
    const poem = `
    This poem is titled ${title}.
  
    The subject is ${subject} ,
    and the villain is ${villain}.
    `
  
    console.log(poem);
  }


  if(symbols.length === 0){
    printCommandHelp();
    process.exit(0);
  }

  switch(symbols[0]){
    case '--help':
      printCommandHelp();
      break;
    case 'createPoem':
      createPoem(symbols.slice(1));
      break;
    case 'balance' || 'b':
      await cli.balance();
      break;
    case 'account' || 'a':
      await cli.account();
      break;
    case 'deposit' || '-D':
      await newDeposit(symbols.slice(1));
      break;
    case 'withdraw' || '-W':
      await newWithdrawal(symbols.slice(1));
      break;
    case 'order' || 'o':
      await newOrder(symbols.slice(1))
      break;
    case 'showMpg':
      await cli.getMpgs()
      break;
    case 'cancelOrder':
      //await cancelOrder()
      break;
    default:
      console.log("Unknown argument");
      break;
  }
}

runCLI()