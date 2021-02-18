exports.isDigit = function(char) {
  return /[0-9]/.test(char);
}

exports.isWhitespace = function(char) {
  return " \t\n".indexOf(char) >= 0;
}

exports.isIdStart = function(char) {
  return /[\a-zA-Z]/.test(char) || "+-/\\*%<>=?!_$@#^&|~".indexOf(char) >= 0;
}

exports.isIdChar = function(char) {
  return /[\a-zA-Z0-9]/.test(char) || "+-/\\*%<>=?!_$@#^&|~".indexOf(char) >= 0;
}

exports.isPunc = function(char) {
  return ";:()[]{},.'".indexOf(char) >= 0;
}

exports.operators = ["+", "-", "*", "/", "//", "%", "**", "="];
