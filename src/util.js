const math = require("mathjs");
const evaluate = require("./interpreter");
const parse = require("./parser");
const lexer = require("./lexer");
const NyxDecimal = require("./types/Decimal");

function parseAndEvaluate(input) {
  return evaluate(parse(lexer(input)));
}

module.exports = { parseAndEvaluate };
