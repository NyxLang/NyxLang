class NyxError extends Error {}

class NyxInputError extends NyxError {
  constructor(msg) {
    super(`Invalid input: ${msg}`);
  }
}

module.exports = {
  NyxInputError
}