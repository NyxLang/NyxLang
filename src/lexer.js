const { isDigit, isWhitespace, isIdStart, isIdChar, isOpChar, operators, isPunc, keywords } = require("./helpers");
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
      type: "Decimal",
      value: number,
      line: input.line,
      col: input.col
    };
  }

  function readIdent() {
    let id = readWhile(ch => isIdChar(ch));
    const type = operators.includes(id)
      ? "Operator"
      : keywords.includes(id)
      ? "Keyword"
      : "Identifier";
    return {
      type,
      line: input.line,
      col: input.col,
      value: id
    };
  }

  function readOp() {
    let op = readWhile(ch => isOpChar(ch));
    return {
      type: "Operator",
      value: op,
      line: input.line,
      col: input.col
    };
  }

  function readNext() {
    readWhile(isWhitespace);
    if (input.eof()) {
      return {
        type: "EOF",
        value: "EOF",
        line: input.line,
        col: input.col,
      };
    }

    let ch = input.peek();

    if (isDigit(ch)) {
      return readNumber();
    } else if (isOpChar(ch)) {
      return readOp();
    } else if (isIdStart(ch)) {
      return readIdent();
    } else if (isPunc(ch)) {
      input.next();
      return {
        type: "Punctuation",
        value: ch,
        line: input.line,
        col: input.col,
      };
    }

    input.croak(`Cannot handle character ${ch}`);
  }

  while (!input.eof()) {
    tokens.push(readNext());
  }

  return tokens;
}

module.exports = Lexer;