function mixin(source, destination) {
  for (let key of Object.getOwnPropertyNames(source)) {
    if (!destination[key]) {
      destination[key] = source[key];
    }
  }
  return destination;
}

module.exports = { mixin };
