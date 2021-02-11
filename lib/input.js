// See http://lisperator.net/pltut/parser/input-stream
const { NyxInputError } = require("./errors");

module.exports = function InputStream(input) {
  let pos = 0;
  let line = 0;
  let col = 0;

  return {
    next,
    peek,
    lookahead,
    eof,
    croak
  };

  function next() {
    let ch = input.charAt(pos++);
    if (ch == "\n") {
      line++;
      col = 0;
    } else {
      col++;
    }
    return ch;
  }

  function peek() {
    return input.charAt(pos);
  }

  function lookahead() {
    return input.charAt(pos + 1);
  }

  function eof() {
    return peek() == "";
  }

  function croak(msg) {
    throw new NyxInputError(`${msg} (at ${line}:${col})`);
  }
}
