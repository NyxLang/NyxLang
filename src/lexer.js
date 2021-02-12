const { isDigit, isWhitespace } = require("./helpers");
const stream = require("./input");

function Lexer(input) {
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
    const start = input.col;
    let number = readWhile(ch => isDigit(ch));
    return {
      type: "Number",
      value: number,
      line: input.line,
      col: start
    };
  }

  function readNext() {
    readWhile(isWhitespace);
    if (input.eof()) {
      return {
        type: "EOF",
        value: "EOF",
        line: input.line,
        col: input.col
      };
    }

    let ch = input.peek();
    if (isDigit(ch)) {
      return readNumber();
    }

    input.croak("Cannot handle character");
  }

  while (!input.eof()) {
    tokens.push(readNext());
  }

  return tokens;
}

module.exports = Lexer;