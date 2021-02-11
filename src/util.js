const evaluate = require("./interpreter");
const parse = require("./parser");
const lexer = require("./lexer");
const stream = require("./input");

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
      item === false ||
      item === null
    ) {
      temp.push(item.toString());
    }
  }
  return temp.join("");
}

module.exports = { parseAndEvaluate, outputString };
