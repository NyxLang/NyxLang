class NyxArray extends Array {}

function Arr(...args) {
  return new NyxArray(...args);
}

module.exports = { Array: Arr };
