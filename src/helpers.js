exports.isDigit = function(char) {
  return /[0-9]/.test(char);
}

exports.isWhitespace = function(char) {
  return " \t\n".indexOf(char) >= 0;
}

exports.isIdChar = function(char) {
  return /[\a-zA-Z_]/.test(char) || "+-/*%.".indexOf(char) >= 0;
}

exports.operators = ["+", "-", "*", "/", "%", "."];
