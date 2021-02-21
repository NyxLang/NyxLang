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
    case "Program":
      let val = null;
      exp.program.forEach((ex) => {
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
      return evaluateParallelDefinition(exp, env);

    case "ConstantParallelDefinition":
      return evaluateParallelDefinition(exp, env, true);

    case "CallExpression":
      return evaluateCall(exp, env);

    case "MemberExpression":
      return evaluateMember(exp, env);

    case "Block":
      return evaluateBlock(exp, env);

    case "IfExpression":
      return evaluateIf(exp, env);

    case "UnlessExpression":
      return evaluateUnless(exp, env);

    case "WhileStatement":
      return executeWhile(exp, env);

    case "UntilStatement":
      return executeUntil(exp, env);

    case "ForStatement":
      return executeFor(exp, env);

    case "Identifier":
      return evaluateIdentifier(exp, env);

    case "Decimal":
      return new NyxDecimal(exp.value);

    case "Boolean":
    case "Nil":
      return exp.value;

    case "ControlStatement":
      return exp.value;
  }
}

function evaluateBlock(exp, env) {
  let val = null;
  const scope = env.extend();
  exp.block.forEach((ex) => {
    val = evaluate(ex, scope);
  });
  return val;
}

function evaluateBinary(exp, env) {
  return applyBinary(
    exp.operator,
    evaluate(exp.left, env),
    evaluate(exp.right, env)
  );
}

function evaluateUnary(exp, env) {
  return applyUnary(exp.operator, evaluate(exp.operand, env));
}

function defineVariable(exp, env) {
  if (env.lookup(exp.name)) {
    throw new Error(`Cannot redeclare identifier ${exp.name}`);
  }
  env.def(exp.name, null);
  return exp.value ? evaluateVariableAssignment(exp.value, env) : null;
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
  const names = (exp.names && exp.names.expressions) || exp.names;
  const values = (exp.values && exp.values.expressions) || exp.values;
  let evaluatedValues;
  if (values) {
    evaluatedValues = values.map((value) => {
      return evaluate(value, exp);
    });
  } else {
    evaluatedValues = names.map((value) => null);
  }
  names.forEach((item, i) => {
    if (constant) {
      val = defineConstant(
        {
          name: item.name,
          value: { name: item.name, value: evaluatedValues[i] },
        },
        env
      );
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

  const name = (exp.left && exp.left.name) || exp.name;
  const value = (exp.right && evaluate(exp.right, env)) || exp.value;
  const oldValue = env.vars[name];

  if (oldValue && oldValue.__constant__) {
    throw new Error("Cannot assign new value to constant");
  }

  if (typeof value == "object") {
    Object.defineProperty(value, "__object_id__", {
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(value, "__type__", {
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(value, "__class__", {
      writable: false,
      enumerable: false,
    });
  }
  env.set(name, {
    __constant__: constant,
    __value__: value,
  });

  return value;
}

function evaluateIdentifier(exp, env) {
  const val = env.get(exp.name);
  return val && val.__value__ ? val.__value__ : val;
}

function evaluateParallelAssignment(exp, env, constant) {
  let val;
  const names = (exp.left && exp.left.expressions) || exp.names.expressions;
  const values = (exp.right && exp.right.expressions) || exp.values.expressions;
  const evaluatedValues = values.map((value) => {
    return evaluate(value, env);
  });
  names.forEach((item, i) => {
    val = evaluateVariableAssignment(
      { name: item.name, value: evaluatedValues[i] },
      env,
      constant
    );
  });
  return val;
}

function evaluateCall(exp, env) {
  let obj = null;
  if (exp.func.type == "MemberExpression") {
    obj = evaluate(exp.func.object, env);
  }
  let func = evaluate(exp.func, env);
  let name =
    exp.func.name || `${exp.func.object.name}.${exp.func.property.name}`;
  if (typeof func != "function") {
    throw new Error(`${name} is not a callable value`);
  }
  return func.apply(
    obj,
    exp.args.map((arg) => evaluate(arg, env))
  );
}

function evaluateMember(exp, env) {
  const obj = evaluate(exp.object, env);
  const prop = exp.property.name;
  if (!obj[prop]) {
    throw new Error(
      `Member ${prop} does not exist on object ${exp.object.name}`
    );
  }
  return obj[prop];
}

function evaluateIf(exp, env) {
  const cond = evaluate(exp.cond, env);
  if (notFalsy(cond)) {
    return evaluate(exp.then, env);
  }
  if (exp.elseifs) {
    for (let elseif of exp.elseifs) {
      if (notFalsy(evaluate(elseif.cond, env))) {
        return evaluate(elseif.then, env);
      }
    }
  }
  return exp.else ? evaluate(exp.else, env) : null;
}

function evaluateUnless(exp, env) {
  const cond = evaluate(exp.cond, env);
  if (!notFalsy(cond)) {
    return evaluate(exp.then, env);
  }
  return exp.else ? evaluate(exp.else, env) : null;
}

function executeWhile(exp, env) {
  let cond = evaluate(exp.cond, env);
  while (notFalsy(cond)) {
    let scope = env.extend();
    let val = executeLoopBody(exp.body, scope);
    if (val == "break") return;
    cond = evaluate(exp.cond, env);
  }
}

function executeUntil(exp, env) {
  let cond = evaluate(exp.cond, env);
  while (!notFalsy(cond)) {
    let scope = env.extend();
    let val = executeLoopBody(exp.body, scope);
    if (val == "break") return;
    cond = evaluate(exp.cond, env);
  }
}

function executeFor(exp, env) {
  const seq = evaluate(exp.seq, env);
  for (let val of seq.__data__) {
    let scope = env.extend();
    if (typeof val == "number") {
      defineVariable(
        {
          name: exp.vars.name,
          value: {
            name: exp.vars.name,
            value: evaluate({ type: "Decimal", value: val }, scope),
          },
        },
        scope
      );
    } else {
      console.log(val);
      defineVariable(
        {
          name: exp.vars.name,
          value: {
            name: exp.vars.name,
            value: val,
          },
        },
        scope
      );
    }
    let v = executeLoopBody(exp.body, scope);
    if (v == "break") return;
  }
}

function executeLoopBody(body, env) {
  let val;
  for (let i = 0; i < body.block.length; i += 1) {
    val = evaluate(body.block[i], env);
    if (val == "break") return "break";
    else if (val == "continue") return "continue";
  }
  return val;
}

function applyBinary(op, left, right) {
  switch (op) {
    case "and":
      return notFalsy(left) && right;
    case "or":
      return notFalsy(left) ? left : right;
  }
  return left[op](right);
}

function applyUnary(operator, operand) {
  switch (operator) {
    case "not":
      return !operand;
  }
  return operand[operator + "@"]();
}

function notFalsy(val) {
  return val !== false && val !== null;
}

module.exports = evaluate;
