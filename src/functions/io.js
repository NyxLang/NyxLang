const outputString = require("../util")["outputString"];

function print(...args) {
  console.log(args.reduce((str, arg) => str + outputString(arg) + " ", ""));
}

module.exports = { print };
