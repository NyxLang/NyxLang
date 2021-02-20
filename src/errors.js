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

class NyxTypeError extends NyxError {
  constructor(msg) {
    super(`TypeError: ${msg}`);
  }
}

module.exports = {
  NyxInputError,
  NyxTypeError,
};
