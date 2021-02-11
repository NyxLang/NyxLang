const repl = require("repl");
const { parseAndEvaluate } = require("./util");

function eval(cmd, context, fileName, callback) {
  callback(null, parseAndEvaluate(cmd));
}

repl.start({ prompt: "nyx> ", eval });
