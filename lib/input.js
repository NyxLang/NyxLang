// See http://lisperator.net/pltut/parser/input-stream
const InputError = require("./errors");

module.exports = function InputStream(input) {
  let pos = 0;
  let line = 0;
  let col = 0;

  return {
    next,
    peek,
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

  function eof() {
    return peek() == undefined;
  }

  function croak(msg) {
    throw new InputError(`msg (at ${line}:${col})`);
  }
}
