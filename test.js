const math = require("mathjs");
const NyxDecimal = require("./src/types/Decimal");

const x = new NyxDecimal(math.bignumber(10), "Decimal", "decimal");
const y = new NyxDecimal(math.bignumber(20), "Decimal", "decimal");

console.log(x["+"](y));