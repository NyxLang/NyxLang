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

    case "VariableParallelDefinition":
      return evaluateParallelDefinition(exp, env)

    case "ConstantParallelDefinition":
      return evaluateParallelDefinition(exp, env, true);

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
  if (env.lookup(exp.name)) {
    throw new Error(`Cannot redeclare identifier ${exp.name}`);
  }
  env.def(exp.name, null);
  return null;
}

function defineConstant(exp, env) {
  if (env.lookup(exp.name)) {
    throw new Error(`Cannot redeclare identifier ${exp.name}`);
  }
  env.def(exp.name, null);
  return evaluateVariableAssignment(exp.value, env, true);
}

function evaluateParallelDefinition(exp, env, constant = false) {
  let val;
  const evaluatedValues = exp.values.map(value => {
    return evaluate(value, exp);
  });
  exp.names.forEach((item, i) => {
    if (constant) {
      val = defineConstant({ name: item.name, value: { name: item.name, value: evaluatedValues[i] } }, env);
    } else {
      val = defineVariable(item, env);
    }
  });

  if (!constant && exp.values) {
    return evaluateParallelAssignment(exp, env);
  }
  return val;
}

function evaluateVariableAssignment(exp, env, constant = false) {
  if (exp && exp.left && exp.left.type == "SequenceExpression") {
    return evaluateParallelAssignment(exp, env, constant);
  }

  const name = exp.left && exp.left.name || exp.name;
  const value = exp.right && evaluate(exp.right, env) || exp.value;
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
  const pointer = env.get(exp.name);
  return env.get(pointer.id)
}

function evaluateParallelAssignment(exp, env, constant) {
  let val;
  const names = exp.left && exp.left.expressions || exp.names.expressions;
  const values = exp.right && exp.right.expressions || exp.values.expressions;
  const evaluatedValues = values.map(value => {
    return evaluate(value, env);
  });
  names.forEach((item, i) => {
    val = evaluateVariableAssignment({name: item.name, value: evaluatedValues[i]}, env, constant);
  });
  return val;
}

function applyBinary(op, left, right) {
  return left[op](right);
}

function applyUnary(operator, operand) {
  return operand[operator + "@"]();
}

module.exports = evaluate;
