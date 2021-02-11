exports.isDigit = function(char) {
  return /[0-9]/.test(char);
}

exports.isWhitespace = function(char) {
  return " \t\n".indexOf(char) >= 0;
}
