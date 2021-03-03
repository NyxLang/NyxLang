const io = require("./io");
const object = require("./object");
const sequences = require("./sequences");

module.exports = { ...io, ...sequences, ...object };
