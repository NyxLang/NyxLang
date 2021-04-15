const Interpreter = require("../src/interpreter/interpreter");
const math = require("../src/objects/_math");

describe("Testing basic numeric operations", () => {
  test("It should properly parse and output Decimal literal input", () => {
    let code = "5.254";
    let output = Interpreter(code);
    expect(output.toString()).toBe("5.254");
    expect(math.typeOf(output)).toBe("BigNumber");
    expect(output.toNumber()).toBe(5.254);

    code = "5.254e+400";
    output = Interpreter(code);
    expect(output.toString()).toBe("5.254e+400");
    expect(output.toNumber()).toBe(Infinity);

    code = "0xaf17c";
    output = Interpreter(code);
    expect(output.toString()).toBe(Number(output.toHexadecimal()).toString());
    expect(output.toNumber()).toBe(Number(output.toHexadecimal()));

    code = "0b11001";
    output = Interpreter(code);
    expect(output.toString()).toBe(Number(output.toBinary()).toString());
    expect(output.toNumber()).toBe(Number(output.toBinary()));

    code = "0o755";
    output = Interpreter(code);
    expect(output.toString()).toBe(Number(output.toOctal()).toString());
    expect(output.toNumber()).toBe(Number(output.toOctal()));
  });

  test("It should properly add two Decimal literals together", () => {
    let code = "5 + 6";
    let output = Interpreter(code);
    expect(output.toString()).toBe("11");
    expect(math.typeOf(output)).toBe("BigNumber");
  });
});
