const NyxDecimal = require("./types/Decimal");

exports.isDigit = function (char) {
  return /[0-9]/.test(char);
};

exports.isWhitespace = function (char) {
  return " \t".indexOf(char) >= 0;
};

exports.isIdStart = function (char) {
  return /[a-zA-Z]/.test(char) || "_$".indexOf(char) >= 0;
};

exports.isIdChar = function (char) {
  return /[a-zA-Z0-9]/.test(char) || "+-/\\*%<>=?!_$@^&|~".indexOf(char) >= 0;
};

exports.isOpChar = function (char) {
  return "+-*/%=<>^&|~!".indexOf(char) >= 0;
};

exports.isPunc = function (char) {
  return ";:()[]{},.'".indexOf(char) >= 0;
};

exports.handleNegativeIndex = function (index, seq) {
  const i = BigInt(index.toString());
  if (i < 0n) {
    const l = BigInt(seq.__length__.toString());
    index = new NyxDecimal((l + i).toString());
  }
  return index;
};

exports.decimalParameterToInt = function (param) {
  return parseInt(param.toString());
};

exports.operators = [
  "+",
  "-",
  "*",
  "/",
  "//",
  "%",
  "**",
  "=",
  "+=",
  "-=",
  "*=",
  "/=",
  "//=",
  "%=",
  "==",
  "<",
  ">",
  ">=",
  "<=",
  "and",
  "or",
  "not",
  "in",
  "->",
  "&",
  "|",
  "~",
  "^",
  ">>",
  "<<",
  ">>>",
];

exports.keywords = [
  "let",
  "const",
  "do",
  "if",
  "else",
  "elseif",
  "true",
  "false",
  "nil",
  "unless",
  "while",
  "break",
  "continue",
  "until",
  "for",
  "def",
  "lambda",
  "return",
];
