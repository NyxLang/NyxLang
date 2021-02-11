const evaluate = require("./interpreter");
const parse = require("./parser");
const lexer = require("./lexer");
const stream = require("./input");

parseAndEvaluate = function(input) {
  return evaluate(parse(lexer(stream(input))));
}

module.exports = { parseAndEvaluate };
