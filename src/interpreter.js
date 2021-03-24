const uuid = require("uuid");
const stream = require("./input");
const lexer = require("./lexer");
const parse = require("./parser");
const Environment = require("./environment");
const NyxDecimal = require("./types/Decimal");
const NyxString = require("./types/String");
const List = require("./types/List");
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

    case "FunctionDefinition":
      return evaluateFunctionDefinition(exp, env);

    case "LambdaExpression":
      return makeLambda(exp, env);

    case "Identifier":
      return evaluateIdentifier(exp, env);

    case "Decimal":
      return new NyxDecimal(exp.value);

    case "Boolean":
    case "Nil":
      return exp.value;

    case "String":
      return new NyxString(exp.value);

    case "ControlStatement":
      return exp.value;

    case "ReturnStatement":
      return executeReturn(exp, env);

    case "List":
      return evaluateList(exp, env);

    case "SliceExpression":
      return evaluateSlice(exp, env);

    default:
      return exp;
  }
}

function evaluateBlock(exp, env) {
  let val = null;
  const scope = env.extend();
  for (let ex of exp.block) {
    val = evaluate(ex, scope);
  }
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
  let value = (exp.right && evaluate(exp.right, env)) || exp.value;
  const oldValue = env.vars[name];

  if (oldValue && oldValue.__constant__) {
    throw new Error("Cannot assign new value to constant");
  }

  if (exp.operator == "+=") {
    value = applyBinary("+", env.get(name).__value__, value);
  } else if (exp.operator == "-=") {
    value = applyBinary("-", env.get(name).__value__, value);
  } else if (exp.operator == "*=") {
    value = applyBinary("*", env.get(name).__value__, value);
  } else if (exp.operator == "/=") {
    value = applyBinary("/", env.get(name).__value__, value);
  } else if (exp.operator == "//=") {
    value = applyBinary("//", env.get(name).__value__, value);
  } else if (exp.operator == "%=") {
    value = applyBinary("%", env.get(name).__value__, value);
  }

  if (typeof value == "object") {
    Object.defineProperty(value, "__object_id__", {
      writable: false,
      enumerable: false,
      value: value.__hash__(),
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
    exp.args.map((arg) => {
      let val = evaluate(arg, env);
      return val;
    })
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

function evaluateList(exp, env) {
  const list = exp.value.map((item) => evaluate(item, env));
  return new List(list);
}

function evaluateSlice(exp, env) {
  const object = evaluate(exp.object, env);
  const index = evaluate(exp.index, env);
  return object["[]"](index);
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
  const seq = evaluate(exp.vars.right, env);
  for (let val of seq) {
    let scope = env.extend();
    if (exp.vars.left.type == "Identifier") {
      defineVariable(
        {
          name: exp.vars.left.name,
          value: {
            name: exp.vars.left.name,
            value: evaluate(val, scope),
          },
        },
        scope
      );
    }

    let v = executeLoopBody(exp.body, scope);
    if (v == "break") return;
  }
}

function evaluateFunctionDefinition(exp, env) {
  const name = exp.name;
  const value = makeLambda(exp, env);
  env.def(name, value);
  return;
}

function makeLambda(exp, env) {
  const lambda = (...args) => {
    let scope = env.extend();
    let defaults = {};
    let names = exp.params.map((param) => {
      if (param.type == "Assignment") {
        defaults[param.left.name] = evaluate(param.right, scope);
        return param.left.name;
      }
      return param.name;
    });
    names.forEach((name, i) => {
      scope.def(
        name,
        { __constant__: false, __value__: args[i] } || defaults[name]
      );
    });
    return executeFunctionBody(exp.body, scope);
  };

  Object.defineProperty(lambda, "__object_id__", {
    writable: false,
    enumerable: false,
    value: uuid.v4(),
  });

  Object.defineProperty(lambda, "__type__", {
    writable: false,
    enumerable: false,
    value: "function",
  });

  Object.defineProperty(lambda, "__class__", {
    writable: false,
    enumerable: false,
    value: "Function",
  });

  return lambda;
}

function executeReturn(exp, env) {
  return {
    __type__: "ReturnStatement",
    value: evaluate(exp.value, env),
  };
}

function executeFunctionBody(body, env) {
  let val;
  if (body.block) {
    for (let exp of body.block) {
      val = evaluate(exp, env);
      if (val && val.__type__ == "ReturnStatement") {
        return val.value;
      }
    }
  } else {
    val = evaluate(body, env);
  }
  return val;
}

function executeLoopBody(body, env) {
  let val;
  if (body.block) {
    for (let i = 0; i < body.block.length; i += 1) {
      val = evaluate(body.block[i], env);
      if (val == "break") return "break";
      else if (val == "continue") return "continue";
    }
  } else {
    val = evaluate(body, env);
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
