const Lexer = require("./lexer");
const stream = require("./input");
const { NyxInputError } = require("./errors");

// Binary operator precedence table
const PRECEDENCE  = {
  "=": 3,
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

  function isKeyword(kw) {
    let tok = peek();
    return tok && tok.type == "Keyword" && (!kw || tok.value == kw) && tok;
  }

  function skipPunc(ch) {
    if (isPunc(ch)) {
      next();
    } else {
      throw new NyxInputError(`Expecting punctuation: ${ch}`);
    }
  }

  function maybeBinary(left, myPrec, sequence = null) {
    console.log(left);
    let tok = isOperator();
    if (!sequence && tok) {
      let hisPrec = PRECEDENCE[tok.value];
      if (hisPrec > myPrec) {
        next();
        return maybeBinary({
          type: tok.value == "=" ? "Assignment" : "BinaryOperation",
          operator: tok.value,
          left,
          right: maybeBinary(parseExpression(), hisPrec),
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

  function parseKeyword() {
    const tok = peek();
    switch (tok.value) {
      case "let":
        return parseVariableDefinition();

      case "const":
        return parseConstantDefinition();
    }
  }

  function parseVariableDefinition() {
    const tok = lookahead();
    return {
      type: "VariableDefinition",
      name: tok.value,
      line: tok.line,
      col: tok.col
    }
  }

  function parseConstantDefinition() {
    const tok = next();
    return {
      type: "ConstantDefinition",
      name: tok.value,
      value: parseExpression(),
      line: tok.line,
      col: tok.col
    }
  }

  function parseSequenceExpression(first, sequence) {
    let expressions = sequence || [];
    let tok = peek();

    expressions.push(first);

    if (tok && tok.value == ",") {
      skipPunc(",");
      return parseExpression(expressions);
    }
    let seq = {
      type: "SequenceExpression",
      expressions,
      line: expressions[0].line,
      col: expressions[0].col
    }
    return maybeBinary(seq, 0);
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

    if (isKeyword(tok.value)) {
      return parseKeyword();
    }

    if (tok && tok.type === "Decimal") {
      next();
      return tok;
    }

    if (tok && tok.type === "Identifier") {
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

  function parseExpression(sequence = null) {
    const exp = maybeBinary(parseAtom(), 0, sequence);
    let tok = peek();
    if (sequence || tok && tok.value == ",") {
      return parseSequenceExpression(exp, sequence);
    }
    return exp;
  }
}

module.exports = parse;
