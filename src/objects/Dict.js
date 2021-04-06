class Dict {}

function dict(...args) {
  let d = new Dict(...args);
  return d;
}

module.exports = { Dict: dict };
