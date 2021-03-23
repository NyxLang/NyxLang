function type(obj) {
  return obj.__type__;
}

function className(obj) {
  return obj.__class__;
}

function id(obj) {
  return obj.__object_id__;
}

function dump(obj) {
  return obj.__dump__();
}

function hash(obj) {
  return obj.__hash__();
}

module.exports = {
  type,
  "class-name": className,
  id,
  dump,
  hash,
};
