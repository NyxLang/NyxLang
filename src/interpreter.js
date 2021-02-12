const stream = require("./input");
const lexer = require("./lexer");
const parse = require("./parser");
const NyxDecimal = require("./types/Decimal");

function evaluate(exp) {
  switch (exp.type) {
    case "Block":
      let val = null;
      exp.block.forEach(ex => {
        val = evaluate(ex);
      });
      return val;

    case "BinaryOperation":
      return evaluateBinary(exp);

    case "Number":
      return new NyxDecimal(exp.value);
  }
}

function evaluateBinary(exp) {
  return applyBinary(exp.operator, evaluate(exp.left), evaluate(exp.right));
}

function applyBinary(op, left, right) {
  return left[op](right);
}

module.exports = evaluate;
