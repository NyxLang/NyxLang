const repl = require("repl");
const Interpreter = require("./interpreter/interpreter");
const outputString = require("./stdlib/io")["output-string"];

function eval(cmd, context, fileName, callback) {
  callback(null, Interpreter(cmd));
}

repl.start({
  prompt: "chipmunk> ",
  input: process.stdin,
  output: process.stdout,
  eval,
  ignoreUndefined: true,
  writer: outputString,
});
