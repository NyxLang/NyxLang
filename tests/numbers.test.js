const Interpreter = require("../src/interpreter/interpreter");
const math = require("../src/objects/_math");

describe("Testing basic numeric operations", () => {
  test("It should properly parse and output Decimal literal input", () => {
    let code = "5.254";
    expect(Interpreter(code).toString()).toBe("5.254");
    expect(math.typeOf(Interpreter(code))).toBe("BigNumber");
    expect(Interpreter(code).toNumber()).toBe(5.254);

    code = "5.254e+400";
    expect(Interpreter(code).toString()).toBe("5.254e+400");
    expect(Interpreter(code).toNumber()).toBe(Infinity);

    code = "0xaf17c";
    let output = Interpreter(code);
    expect(output.toString()).toBe(parseInt(output.toHexadecimal()).toString());
    expect(output.toNumber()).toBe(parseInt(output.toHexadecimal()));
  });

  code = "0b11001";
  output = Interpreter(code);
  // I have no idea why parseInt works with hex literals but not binary or octal
  let outputStr = output.toBinary().split("b")[1];
  expect(output.toString()).toBe(parseInt(outputStr, 2).toString());
  expect(output.toNumber()).toBe(parseInt(outputStr, 2));

  code = "0o755";
  output = Interpreter(code);
  outputStr = output.toOctal().split("o")[1];
  expect(output.toString()).toBe(parseInt(outputStr, 8).toString());
  expect(output.toNumber()).toBe(parseInt(outputStr, 8));
});
