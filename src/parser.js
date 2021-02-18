const Lexer = require("./lexer");
const stream = require("./input");
const { NyxInputError } = require("./errors");

// Binary operator precedence table
const PRECEDENCE  = {
  "+": 14, "-": 14,
  "*": 15, "/": 15, "//": 15, "%": 15,
  "**": 16
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
      throw new NyxInputError(`Expecting punctuation: ${ch}`);
    }
  }

  function maybeBinary(left, myPrec) {
    let tok = isOperator();
    if (tok) {
      let hisPrec = PRECEDENCE[tok.value];
      if (hisPrec > myPrec) {
        next();
        return maybeBinary({
          type: tok.value == "=" ? "Assignment" : "BinaryOperation",
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

  function parseUnary() {
    const tok = peek();
    next();
    return {
      type: "UnaryOperation",
      operator: tok.value,
      operand: parseAtom(),
      line: tok.line,
      col: tok.col
    }
  }

  function parseAtom() {
    let tok = peek();

    if (isPunc("(")) {
      next();
      let exp = parseExpression();
      skipPunc(")");
      return exp;
    }

    if (isOperator(tok.value)) {
      return parseUnary();
    }

    if (tok && tok.type === "Decimal") {
      next();
      return tok;
    }
  }

  function parseToplevel() {
    let program = [];
    while (peek() && peek().type !== "EOF") {
      program.push(parseExpression());
      next();
    }
    return { type: "Block", block: program };
  }

  function parseExpression() {
    return maybeBinary(parseAtom(), 0);
  }
}

module.exports = parse;
