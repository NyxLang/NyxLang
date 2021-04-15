"use strict";

const uuid = require("uuid");
const hash = require("object-hash");
const Parser = require("../parser/parser");
const Environment = require("../environment");
const { String, List } = require("../stdlib/types");
const builtins = require("../objects/builtins"); // need to be processed with obj-ids, etc.
const builtinFunctions = require("../functions/builtins"); // need to be processed with obj-ids, etc.
const globals = require("../stdlib/globals");

const globalEnv = new Environment();

for (let key of Object.keys(globals)) {
  globalEnv.vars[key] = createEnvVarValue(globals[key], true);
}
for (let key of Object.keys(builtins)) {
  globalEnv.vars[key] = createEnvVarValue(builtins[key], true);
}
for (let key of Object.keys(builtinFunctions)) {
  globalEnv.vars[key] = createEnvVarValue(builtinFunctions[key], true);
}

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

    case "Assignment":
      return evaluateVariableAssignment(exp, env);

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
      return builtins.Decimal(exp.value);

    case "Double":
      return builtins.Double(exp.value);

    case "Boolean":
    case "Nil":
      return exp.value;

    case "String":
      return new String(exp.value);

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
  if (exp.names) {
    return evaluateParallelDefinition(exp, env);
  }
  const name = exp.name.name;
  if (env.existsInCurrentScope(name)) {
    throw new Error(`Cannot redeclare identifier ${name}`);
  }
  env.def(name, createEnvVarValue(evaluate(exp.value, env), exp.constant));
}

function createEnvVarValue(value, constant = false) {
  if (constant) {
    Object.freeze(value);
  }
  return {
    constant,
    value,
  };
}

function evaluateParallelDefinition(exp, env) {
  let names = exp.names.expressions;
  let values;
  if (exp.values.type == "SequenceExpression") {
    values = exp.values.expressions.map((value) => evaluate(value, env));
  } else {
    [names, values] = unpackIterable(names, exp.values, env);
  }
  const valuesLength = values.__length__ ? values.__length__ : values.length;
  if (names.length > valuesLength) {
    throw new Error(
      `Not enough values to unpack (expected ${names.length}, got ${valuesLength}) at ${exp.line}:${exp.col}`
    );
  } else if (names.length < valuesLength) {
    throw new Error(
      `Too many values to unpack (expected ${names.length}, got ${valuesLength})`
    );
  }
  names.forEach((node, i) => {
    let name = node.name;
    if (env.existsInCurrentScope(name)) {
      throw new Error(
        `Cannot redeclare identifier ${name} at ${node.line}:${node.col}`
      );
    }
    env.def(name, createEnvVarValue(values[i], exp.constant));
  });
}

function unpackIterable(names, value, env) {
  const iter = evaluate(value, env);
  try {
    [...iter];
  } catch (e) {
    throw new Error(
      `Value to unpack must be iterable at ${value.line}:${value.col}`
    );
  }

  let values = [];
  names = names.map((name, i) => {
    if (name.type == "UnaryOperation" && name.operator == "*") {
      values[i] = iter.slice(i, iter.__length__); // need to change this property to .length when creating new List class
      return name.operand;
    } else if (i > names.length - 1) {
      throw new Error(
        `"Cannot have any additional variable names after spread operation"`
      );
    }
    values[i] = iter["[]"](builtins.Decimal(i));
    return name;
  });
  return [names, values];
}

function evaluateVariableAssignment(exp, env) {
  if (exp.left.type == "SequenceExpression") {
    return evaluateParallelAssignment(exp, env);
  } else if (exp.left.type == "SliceExpression") {
    return evaluateIndexedAssignment(exp, env);
  }

  const name = exp.left.name;
  const oldValue = env.get(name);
  if (!oldValue) {
    throw new Error(
      `Must define variable ${name} before assigning to it at ${exp.line}:${exp.col}`
    );
  } else if (oldValue.constant) {
    throw new Error(
      `Cannot reassign to constant variable at ${exp.line}:${exp.col}`
    );
  }
  let value = evaluate(exp.right, env);

  if (exp.operator == "+=") {
    value = applyBinary("+", env.get(name).value, value);
  } else if (exp.operator == "-=") {
    value = applyBinary("-", env.get(name).value, value);
  } else if (exp.operator == "*=") {
    value = applyBinary("*", env.get(name).value, value);
  } else if (exp.operator == "/=") {
    value = applyBinary("/", env.get(name).value, value);
  } else if (exp.operator == "//=") {
    value = applyBinary("//", env.get(name).value, value);
  } else if (exp.operator == "%=") {
    value = applyBinary("%", env.get(name).value, value);
  }

  env.set(name, createEnvVarValue(value));
}

function evaluateIdentifier(exp, env) {
  const val = env.get(exp.name);
  if (val) {
    return val.value;
  }
  throw new Error(`Undefined identifier ${exp.name} at ${exp.line}:${exp.col}`);
}

function evaluateParallelAssignment(exp, env) {
  let names = exp.left.expressions;
  let values;
  if (exp.right.type == "SequenceExpression") {
    values = exp.right.expressions.map((value) => evaluate(value, env));
  } else {
    [names, values] = unpackIterable(names, exp.right, env);
  }
  names.forEach((name) => {
    if (!env.get(name.name)) {
      throw new Error(
        `Must define variable ${name.name} before assigning to it at ${exp.line}:${exp.col}`
      );
    }
  });
  const valuesLength = values.__length__ ? values.__length__ : values.length;
  if (names.length > valuesLength) {
    throw new Error(
      `Not enough values to unpack (expected ${names.length}, got ${valuesLength}) at ${exp.line}:${exp.col}`
    );
  } else if (names.length < valuesLength) {
    throw new Error(
      `Too many values to unpack (expected ${names.length}, got ${valuesLength})`
    );
  }
  names.forEach((node, i) => {
    env.def(node.name, createEnvVarValue(values[i], exp.constant));
  });
}

function evaluateIndexedAssignment(exp, env) {
  const object = evaluate(exp.left.object, env);
  const index = evaluate(exp.left.index, env);
  if (["[]="] in object) {
    return object["[]="](index, evaluate(exp.right, env));
  }
  throw new Error(
    `Object of type ${object.__type__} does not support indexed assignment`
  );
}

function evaluateCall(exp, env) {
  let obj = null;
  if (exp.func.type == "MemberExpression") {
    obj = evaluate(exp.func.object, env);
  }
  let func = evaluate(exp.func, env);
  let name = "";
  if (exp.func.name) {
    name = exp.func.name;
  } else if (exp.func.object && exp.func.property) {
    name = `${exp.func.object.name}.${exp.func.property.name}`;
  } else {
    name = `func.__name__`;
  }

  if (typeof func != "function") {
    throw new Error(`${name} is not a callable value`);
  }
  const argNames = func.__params__ || getArgNames(func);
  let args = new Array(argNames.length);
  let argsParam = false;
  let keywordArgs = false;
  let argsLength = 0;
  let kwargsLength = 0;
  let k = 0;
  for (let i = 0; i < exp.args.length; i++) {
    // Detect *args param and pack its args into list
    if (isRestArg(argNames[k])) {
      let rest;
      [i, rest] = evaluateRestArgs(i, exp.args, env);
      args[k] = rest;
      argsParam = true;
      // Detect splat operation and unpack
    } else if (isSplatArg(exp.args[i])) {
      [k, args, argsLength] = unpackSplatArg(k, exp.args[i], args, env);
      // Detect keyword argument
    } else if (isKeywordArg(exp.args[i])) {
      if (argsParam) {
        kwargsLength++;
      } else {
        argsLength++;
      }
      let idx = argNames.findIndex((name) => name == exp.args[i].left.name);
      if (idx > -1) {
        args[idx] = evaluate(exp.args[i].right, env);
        keywordArgs = true;
      }
      // Detect positional argument
    } else if (!argsParam && !keywordArgs) {
      args[k] = evaluate(exp.args[i], env);
      argsLength++;
    } else {
      throw new Error(
        "Cannot have positional arguments after keyword arguments"
      );
    }
    k++;
  }
  let v = func.apply(obj, args);
  return v;
}

function isRestArg(arg) {
  return arg && arg.match(/^\*/);
}

function evaluateRestArgs(idx, args, env) {
  let rest = [];
  let i;
  for (i = idx; i < args.length; i++) {
    if (args[i].type == "Assignment") {
      break;
    }
    rest.push(args[i]);
  }
  rest = rest.map((arg) => evaluate(arg, env));
  rest = new List(rest);
  return [i - 1, rest];
}

function isSplatArg(arg) {
  return arg.type == "UnaryOperation" && arg.operator == "*";
}

function unpackSplatArg(idx, splatArg, callArgs, argsLength, env) {
  let value = evaluate(splatArg.operand, env);
  let i = idx;
  try {
    for (let v of value) {
      // mutates callArgs
      callArgs[i] = v;
      argsLength++;
      i++;
    }
    i--; // Because k will increment at bottom of loop, leaving a gap
    // in args array if not decremented here
  } catch (e) {
    throw new Error("Cannot unpack a non-iterable object");
  }
  return [i, callArgs, argsLength];
}

function isKeywordArg(arg) {
  return arg.type == "Assignment";
}

const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getArgNames(func) {
  let fnString = func.toString().replace(STRIP_COMMENTS, "");
  let result = fnString
    .slice(fnString.indexOf("(") + 1, fnString.indexOf(")"))
    .match(ARGUMENT_NAMES);
  if (result == null) {
    result = [];
  }
  return result;
}

function evaluateMember(exp, env) {
  let obj = evaluate(exp.object, env);
  let prop = exp.property.name;

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
  let i = 0;
  for (let val of seq) {
    let scope = env.extend();
    if (exp.vars.left.type == "Identifier") {
      defineVariable(
        {
          name: exp.vars.left,
          value: val,
          line: exp.vars.line,
          col: exp.vars.col,
        },
        scope
      );
    } else if (exp.vars.left.type == "SequenceExpression") {
      defineVariable(
        {
          names: exp.vars.left,
          values: val,
          line: exp.vars.line,
          col: exp.vars.col,
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
  env.def(name, createEnvVarValue(value));
}

function makeLambda(exp, env) {
  let argsParam = false;
  let argLength = 0;
  let kwargsLength = 0;
  const params = exp.params.map((param) => {
    if (argsParam && param.operator && param.operator == "*") {
      throw new Error(
        "Can only have 1 positional args param in a function definition"
      );
    }
    if (param.name) {
      if (argsParam) {
        kwargsLength++;
      } else {
        argLength++;
      }
      return param.name;
    } else if (param.type == "Assignment") {
      return param.left.name;
    } else if (param.type == "UnaryOperation") {
      if (param.operator == "*") {
        argsParam = true;
        return `*${param.operand.name}`;
      } else {
        throw new Error(
          `Unrecognized operator ${param.operator} in function definition`
        );
      }
    }
  });
  const lambda = function (...args) {
    let scope = env.extend();
    scope.def("self", this);
    let defaults = {};
    let names = exp.params.map((param) => {
      if (param.type == "UnaryOperation") {
        if (param.operator == "*") {
          return param.operand.name;
        }
      }
      if (param.type == "Assignment") {
        defaults[param.left.name] = evaluate(param.right, scope);
        return param.left.name;
      }
      return param.name;
    });
    let i = 0;
    for (let name of names) {
      scope.def(name, { __value__: args[i] } || defaults[name]);
      i++;
    }
    return executeFunctionBody(exp.body, scope);
  };

  lambda.__call__ = function __call__(context, ...args) {
    return function () {
      lambda.call(context, ...args);
    };
  };

  lambda.__bind__ = function __bind__(context, ...args) {
    return function () {
      lambda.bind(context, ...args);
    };
  };

  Object.defineProperty(lambda, "__call__", {
    writable: false,
    enumerable: false,
  });

  Object.defineProperty(lambda, "__bind__", {
    writable: false,
    enumerable: false,
  });

  Object.defineProperty(lambda, "__params__", {
    writable: false,
    enumerable: false,
    value: params,
  });

  Object.defineProperty(lambda, "__name__", {
    writable: false,
    enumerable: false,
    value: exp.name || `lambda-${hash(uuid.v4())}`,
  });

  Object.defineProperty(lambda, "__args_length__", {
    writable: false,
    enumerable: false,
    value: argLength,
  });

  Object.defineProperty(lambda, "__kwargs_length__", {
    writable: false,
    enumerable: false,
    value: kwargsLength,
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

  if (typeof left == "boolean" || left == null) {
    if (op == "==") {
      return left === right;
    }
  }

  try {
    return left[op](right);
  } catch (e) {
    throw new Error(
      `Cannot perform operation ${left} ${op} ${right} with operands of type ${left.__type__} and ${right.__type__}`
    );
  }
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

module.exports = function (input) {
  return evaluate(Parser(input));
};
