const { isDigit, isWhitespace } = require("./helpers");
const stream = require("./input");

module.exports = function Lexer(input) {
  let current = null;
  let tokens = [];

  function readWhile(predicate) {
    let str = "";
    while (!input.eof() && predicate(input.peek())) {
      str += input.next();
    }
    return str;
  }

  function readNumber() {
    let number = readWhile(ch => isDigit(ch));
    return {
      type: "Number",
      value: number
    };
  }

  function readNext() {
    readWhile(isWhitespace);
    if (input.eof()) return null;

    let ch = input.peek();
    if (isDigit(ch)) {
      return readNumber();
    }
    input.croak("Cannot handle character");
  }

  while (!input.eof()) {
    tokens.push(readNext());
  }
  tokens.push({
    type: "EOF",
    value: "EOF"
  });

  return tokens;
}
