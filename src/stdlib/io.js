const readlineSync = require("readline-sync");
const v = require("voca");

function outputString(...args) {
  let temp = [];
  for (let item of args) {
    if (item || item === 0 || item === "" || item === false) {
      if (typeof item == "function") {
        temp.push(`<Function ${item.__object_id__ || item.name}>`);
      } else {
        temp.push(item.toString());
      }
    } else if (item == null) {
      return "nil";
    }
  }
  return temp.join("");
}

function print(...args) {
  for (let arg of args) {
    console.log(outputString(arg));
  }
  return null;
}

function sprintf(...args) {
  return v.sprintf(...args);
}

function printf(...args) {
  print(sprintf(...args));
}

function input(msg) {
  return readlineSync.question(msg + "\n");
}

module.exports = {
  "output-string": outputString,
  print,
  sprintf,
  printf,
  input,
};
