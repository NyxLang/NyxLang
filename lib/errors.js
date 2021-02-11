class NyxError extends Error {
  constructor(msg) {
    super(msg);
  }
}

class NyxInputError extends NyxError {
  constructor(msg) {
    super(`Invalid input: ${msg}`);
  }
}

module.exports = {
  NyxInputError
}