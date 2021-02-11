const stream = require("./input");
const lexer = require("./lexer");
const parse = require("./parser");

function evaluate(exp) {
  switch (exp.type) {
    case "Block":
      let val = null;
      exp.block.forEach(ex => {
        val = evaluate(ex);
      });
      return val;

    case "Number":
      return BigInt(exp.value);
  }
}

console.log(evaluate(parse(lexer(stream("15")))));