const Lexer = require("./lexer");
const stream = require("./input");

module.exports = function parse(input) {
  let current = 0;

  return parseToplevel();

  function next() {
    current += 1;
  }

  function peek() {
    return input[current] || null;
  }

  function lookahead() {
    return input[current + 1] || null;
  }

  function parseAtom() {
    let tok = peek();
    if (tok.type === "Number") {
      return tok;
    }
  }

  function parseToplevel() {
    let program = [];
    while (peek().type !== "EOF") {
      program.push(parseExpression());
      next();
    }
    return { type: "Block", block: program };
  }

  function parseExpression() {
    return parseAtom();
  }
}
