class NyxString extends String {}

function Str(value) {
  return new NyxString(value);
}

module.exports = { String: Str };
