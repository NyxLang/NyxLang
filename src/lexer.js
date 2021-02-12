const { isDigit, isWhitespace, isIdChar, operators } = require("./helpers");
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
      start,
      end: input.col
    };
  }

  function readIdent() {
    const start = input.col;
    let id = readWhile(ch => isIdChar(ch));
    const type = operators.includes(id) ? "Operator" : "Identifier";
    return {
      type,
      line: input.line,
      start,
      end: input.col,
      value: id
    };
  }

  function readNext() {
    readWhile(isWhitespace);
    if (input.eof()) {
      return {
        type: "EOF",
        value: "EOF",
        line: input.line,
        start: input.col,
        end: input.col
      };
    }

    let ch = input.peek();
    if (isDigit(ch)) {
      return readNumber();
    } else if (isIdChar(ch)) {
      return readIdent();
    }

    input.croak("Cannot handle character");
  }

  while (!input.eof()) {
    tokens.push(readNext());
  }

  return tokens;
}

module.exports = Lexer;