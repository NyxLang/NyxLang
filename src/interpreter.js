const stream = require("./input");
const lexer = require("./lexer");
const parse = require("./parser");
const Environment = require("./environment");
const NyxDecimal = require("./types/Decimal");

const globalEnv = new Environment();

function evaluate(exp, env = globalEnv) {
  switch (exp.type) {
    case "Block":
      let val = null;
      exp.block.forEach(ex => {
        val = evaluate(ex, env);
      });
      return val;

    case "BinaryOperation":
      return evaluateBinary(exp, env);

    case "UnaryOperation":
      return evaluateUnary(exp, env);

    case "VariableDefinition":
      return defineVariable(exp, env);

    case "ConstantDefinition":
      return defineConstant(exp, env);

    case "Assignment":
      return evaluateVariableAssignment(exp, env);

    case "Identifier":
      return evaluateIdentifier(exp, env);

    case "Decimal":
      return new NyxDecimal(exp.value);
  }
}

function evaluateBinary(exp, env) {
  return applyBinary(exp.operator, evaluate(exp.left, env), evaluate(exp.right, env));
}

function evaluateUnary(exp, env) {
  return applyUnary(exp.operator, evaluate(exp.operand, env));
}

function defineVariable(exp, env) {
  const e = env.def(exp.name, null);
  return null;
}

function defineConstant(exp, env) {
  env.def(exp.name, null);
  evaluateVariableAssignment(exp.value, env, true);
  return null
}

function evaluateVariableAssignment(exp, env, constant = false) {
  const name = exp.left.value;
  const value = evaluate(exp.right, env);
  const oldValue = env.vars[name];

  if (oldValue && oldValue.constant) {
    throw new Error("Cannot assign new value to constant");
  }

  Object.defineProperty(value, "__object_id__", {
    writable: false,
    enumerable: false
  });

    Object.defineProperty(value, "__type__", {
    writable: false,
    enumerable: false
  });

    Object.defineProperty(value, "__class__", {
    writable: false,
    enumerable: false
  });

  Object.defineProperty(value, "__constant__", {
    writable: false,
    enumerable: false,
    value: constant
  })

  env.set(name, {
    id: value.__object_id__,
    type: value.__type__,
    class: value.__class__,
    constant
  });

  env.def(value.__object_id__, value);

  return value;
}

function evaluateIdentifier(exp, env) {
  const pointer = env.get(exp.value);
  return env.get(pointer.id)
}

function applyBinary(op, left, right) {
  return left[op](right);
}

function applyUnary(operator, operand) {
  return operand[operator + "@"]();
}

module.exports = evaluate;
