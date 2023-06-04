dex-cli is a command line tool made to easily easily perform common tasks within the dexterity sdk.

dex-cli is currently able to:

* check your trading account info and balance
* perform deposits to your trading account
* withdraw uxdc from your trading account
* show the available mpgs

This curret interation depends on a future dexterity api update, which supresses some garbage
that goes to stdin when using some functions.

There is a demo available on youtube, but for an older, limited set of comments.

This command line tool only runs on windows through dex.bat.

To run on other operating systems, use npm index.js {arguments}

For this CLI tool to run, you need to have a config.json file in the root directory with the following format:

{
  "field1": "Updated Value 1concat",
  "field2": 342,
  "privateKey": [],
  "Trg": "",
  "Mpg": ""
}

The private key field needs to be an array in the same format that solflare uses.

How to run on Windows:

* Install node.js
* Do npm install in the root directory
* Execute .\dex {arguments}