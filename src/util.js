const math = require("mathjs");
const evaluate = require("./interpreter");
const parse = require("./parser");
const lexer = require("./lexer");
const stream = require("./input");
const NyxDecimal = require("./types/Decimal");

function parseAndEvaluate(input) {
  return evaluate(parse(lexer(stream(input))));
}

function outputString(...args) {
  let temp = [];
  for (let item of args) {
    if (
      item ||
      item === 0 ||
      item === "" ||
      item === false
    ) {
      temp.push(item.toString());
    } else if (item == null) {
      return "nil";
    }
  }
  return temp.join("");
}

module.exports = { parseAndEvaluate, outputString };
