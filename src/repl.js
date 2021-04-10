const repl = require("repl");
const Interpreter = require("./interpreter/interpreter");
const outputString = require("./util")["outputString"];

function eval(cmd, context, fileName, callback) {
  callback(null, Interpreter(cmd));
}

repl.start({
  prompt: "nyx> ",
  input: process.stdin,
  output: process.stdout,
  eval,
  ignoreUndefined: true,
  writer: outputString,
});
