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

    case "UnaryOperation":
      return evaluateUnary(exp);

    case "Decimal":
      return new NyxDecimal(exp.value);
  }
}

function evaluateBinary(exp) {
  return applyBinary(exp.operator, evaluate(exp.left), evaluate(exp.right));
}

function evaluateUnary(exp) {
  return applyUnary(exp.operator, evaluate(exp.operand));
}

function applyBinary(op, left, right) {
  return left[op](right);
}

function applyUnary(operator, operand) {
  return operand[operator + "@"]();
}

module.exports = evaluate;
