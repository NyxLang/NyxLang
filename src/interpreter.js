const stream = require("./input");
const lexer = require("./lexer");
const parse = require("./parser");
const Environment = require("./environment");
const NyxDecimal = require("./types/Decimal");
const globals = require("./stdlib/globals");

const globalEnv = new Environment();
globalEnv.vars = { ...globals };
const main = globalEnv.extend();

function evaluate(exp, env = main) {
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

    case "CallExpression":
      return evaluateCall(exp, env);

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
  const names = exp.names && exp.names.expressions || exp.names;
  const values = exp.values && exp.values.expressions || exp.values;
  const evaluatedValues = values.map(value => {
    return evaluate(value, exp);
  });
  names.forEach((item, i) => {
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

  if (oldValue && oldValue.__constant__) {
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
    __id__: value.__object_id__,
    __type__: value.__type__,
    __class__: value.__class__,
    __constant__: constant
  });

  env.def(value.__object_id__, value);

  return value;
}

function evaluateIdentifier(exp, env) {
  const pointer = env.get(exp.name);
  if (pointer && pointer.__id__) {
    return env.get(pointer.__id__)
  }
  return pointer;
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

function evaluateCall(exp, env) {
  let func = evaluate(exp.func, env);
  return func.apply(null, exp.args.map(arg => evaluate(arg, env)));
}

function applyBinary(op, left, right) {
  return left[op](right);
}

function applyUnary(operator, operand) {
  return operand[operator + "@"]();
}

module.exports = evaluate;
