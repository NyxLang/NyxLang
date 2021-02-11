const stream = require("./input");
const lexer = require("./lexer");
const parse = require("./parser");
const NyxNumber = require("./types/Number");

function evaluate(exp) {
  switch (exp.type) {
    case "Block":
      let val = null;
      exp.block.forEach(ex => {
        val = evaluate(ex);
      });
      return val;

    case "Number":
      return new NyxNumber(exp.value);
  }
}

module.exports = evaluate;
