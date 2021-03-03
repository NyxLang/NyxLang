const readlineSync = require("readline-sync");

function outputString(...args) {
  let temp = [];
  for (let item of args) {
    if (item || item === 0 || item === "" || item === false) {
      if (typeof item == "function") {
        temp.push(`<Function ${item.__object_id__}>`);
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

function input(msg) {
  return readlineSync.question(msg + "\n");
}

module.exports = { "output-string": outputString, print, input };
