const math = require("mathjs");
const evaluate = require("./interpreter");
const parse = require("./parser");
const lexer = require("./lexer");
const stream = require("./input");

function parseAndEvaluate(input) {
  return evaluate(parse(lexer(input)));
}

module.exports = { parseAndEvaluate };
