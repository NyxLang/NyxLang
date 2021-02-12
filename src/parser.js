const Lexer = require("./lexer");
const stream = require("./input");

const PRECEDENCE  = {
  "+": 14, "-": 14,
  "*": 15, "/": 15, "%": 15
}

function parse(input) {
  let current = 0;

  return parseToplevel();

  function next() {
    current += 1;
    return input[current];
  }

  function peek() {
    return input[current] || null;
  }

  function lookahead(i=1) {
    return input[current + i] || null;
  }

  function isPunc(ch) {
    let tok = peek();
    return tok && tok.type == "Punctuation" && (!ch || tok.value === ch) && tok;
  }

  function isOperator(op) {
    let tok = peek();
    return tok && tok.type === "Operator" && (!op || tok.value === op) && tok;
  }

  function skipPunc(ch) {
    if (isPunc(ch)) {
      next();
    } else {
      input.croak(`Expecting punctuation: ${ch}`);
    }
  }

  function maybeBinary(left, myPrec) {
    next();
    let tok = isOperator();
    if (tok) {
      let hisPrec = PRECEDENCE[tok.value];
      if (hisPrec > myPrec) {
        next();
        return maybeBinary({
          type: "BinaryOperation",
          operator: tok.value,
          left,
          right: maybeBinary(parseAtom(), hisPrec),
          line: left.line,
          col: left.col,
        }, myPrec);
      }
    }
    return left;
  }

  function parseAtom() {
    let tok = peek();
    if (tok && tok.type === "Number") {
      return tok;
    }
  }

  function parseToplevel() {
    let program = [];
    while (peek() && peek().type !== "EOF") {
      program.push(parseExpression());
      next();
    }
    console.log(program);
    return { type: "Block", block: program };
  }

  function parseExpression() {
    return maybeBinary(parseAtom(), 0);
  }
}

module.exports = parse;
