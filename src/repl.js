const repl = require("repl");
const { parseAndEvaluate, outputString } = require("./util");

function eval(cmd, context, fileName, callback) {
  callback(null, parseAndEvaluate(cmd));
}

repl.start({
  prompt: "nyx> ",
  input: process.stdin,
  output: process.stdout,
  eval,
  ignoreUndefined: true,
  writer: outputString
});
