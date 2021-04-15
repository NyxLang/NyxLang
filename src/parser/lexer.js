const {
  isDigit,
  isWhitespace,
  isIdStart,
  isIdChar,
  isOpChar,
  operators,
  isPunc,
  keywords,
} = require("../helpers");
const { NyxInputError } = require("../errors");

function Lexer(input) {
  let pos = 0;
  let line = 1;
  let col = 1;
  let tokens = [];
  let currentIndent = 0;
  let indentStack = [];

  function next() {
    let ch = input.charAt(pos++);
    if (ch == "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
    return ch;
  }

  function peek() {
    return input.charAt(pos);
  }

  function lookahead(i = 1) {
    return input.charAt(pos + i);
  }

  function eof() {
    return peek() == "";
  }

  function croak(msg) {
    throw new NyxInputError(`${msg} (at ${line}:${col})`);
  }

  function readWhile(predicate) {
    let str = "";
    while (!eof() && predicate(peek())) {
      str += next();
    }
    return str;
  }

  function readNumber() {
    let number = readWhile((ch) => isDigit(ch));
    let ch = peek();
    if (
      ch.toLowerCase() == "x" ||
      ch.toLowerCase() == "o" ||
      ch.toLowerCase() == "b"
    ) {
      if (number == "0") {
        number += ch;
        next();
        number += readWhile((ch) => /[a-zA-Z0-9]/.test(ch));
      } else {
        croak(`Invalid numeric literal`);
      }
    }
    if (peek() == ".") {
      if (isDigit(lookahead())) {
        number += next();
        number += readWhile((ch) => isDigit(ch));
      }
    }
    if (peek() == "e") {
      number += next();
      if (peek() == "+" || peek() == "-") {
        number += next();
        number += readWhile((ch) => isDigit(ch));
      } else {
        croak(`Invalid numeric literal`);
      }
    }
    if (peek() == "d") {
      next(); // advance pointer to next char in input stream
      return {
        type: "Double",
        value: number,
        line: line,
        col: col,
      };
    }
    return {
      type: "Decimal",
      value: number,
      line: line,
      col: col,
    };
  }

  function readEscapeSequence(ch) {
    let str = "";
    if (ch == "n") {
      str += "\n";
    } else if (ch == "b") {
      str += "\b";
    } else if (ch == "f") {
      str += "\f";
    } else if (ch == "r") {
      str += "\r";
    } else if (ch == "t") {
      str += "\t";
    } else if (ch == "v") {
      str += "\v";
    } else if (ch == "0") {
      str += "\0";
    } else if (ch == "'") {
      str += "'";
    } else if (ch == '"') {
      str += '"';
    } else if (ch == "\\") {
      str += "\\";
    }
    return str;
  }

  function readEscaped(end, multiline = false) {
    let escaped = false;
    let str = "";
    next();
    while (!eof()) {
      let ch = next();
      if (escaped) {
        str += readEscapeSequence(ch);
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else if (ch == "\n" && !multiline) {
        throw new Error(`Unexpected EOL in string literal at ${line}:${col}`);
      } else {
        str += ch;
      }
    }
    return str;
  }

  function readString(start) {
    return {
      type: "String",
      value: readEscaped(start),
      line,
      col,
    };
  }

  function readIdent() {
    let id = readWhile((ch) => isIdChar(ch));
    const type = operators.includes(id)
      ? "Operator"
      : keywords.includes(id)
      ? "Keyword"
      : "Identifier";
    return {
      type,
      line: line,
      col: col,
      value: id,
    };
  }

  function readOp() {
    let op = readWhile((ch) => isOpChar(ch));
    return {
      type: "Operator",
      value: op,
      line: line,
      col: col,
    };
  }

  function readIndent() {
    let spaces = readWhile((ch) => " ".indexOf(ch) >= 0);
    return spaces.length || 0;
  }

  function skipComment() {
    readWhile((ch) => ch != "\n");
    next();
  }

  function readNext() {
    readWhile((c) => isWhitespace(c));

    let ch = peek();

    if (ch == "#") {
      skipComment();
      return readNext();
    }

    if (isDigit(ch)) {
      return readNumber();
    } else if (ch == '"' || ch == "'") {
      return readString(ch);
    } else if (isOpChar(ch)) {
      return readOp();
    } else if (isIdStart(ch)) {
      return readIdent();
    } else if (ch == ":" && lookahead() == "\n") {
      next();
      next();
      let newIndent = readIndent();
      if (currentIndent >= newIndent) {
        throw new NyxInputError(`Indent should increase when defining block`);
      } else {
        currentIndent = newIndent;
      }
      indentStack.push(currentIndent);
      return {
        type: "Indent",
        value: currentIndent,
        line: line,
        col: col,
      };
    } else if (ch == "\n") {
      next();
      let newIndent = readIndent();
      if (newIndent < currentIndent) {
        while (newIndent < currentIndent) {
          indentStack.pop();
          currentIndent = indentStack[indentStack.length - 1] || 0;
          tokens.push({
            type: "Dedent",
            value: currentIndent,
            line: line,
            col: col,
          });
        }
        return;
      } else {
        return {
          type: "Newline",
          value: "\n",
          line: line,
          col: col,
        };
      }
    } else if (isPunc(ch)) {
      next();
      return {
        type: "Punctuation",
        value: ch,
        line: line,
        col: col,
      };
    } else {
      croak(`Cannot handle character ${ch}`);
    }
  }

  while (!eof()) {
    let token = readNext();
    if (token) {
      tokens.push(token);
    }
  }

  tokens.push({
    type: "EOF",
    value: "EOF",
    line: line,
    col: col,
  });

  return tokens;
}

module.exports = Lexer;
