const Lexer = require("./lexer");
const stream = require("./input");
const { NyxInputError } = require("./errors");

// Binary operator precedence table
const PRECEDENCE = {
  "=": 3,
  or: 6,
  and: 7,
  "==": 11,
  "<": 11,
  ">": 11,
  "<=": 11,
  ">=": 11,
  "+": 14,
  "-": 14,
  "*": 15,
  "/": 15,
  "//": 15,
  "%": 15,
  "**": 16,
};

function parse(input) {
  let current = 0;

  return parseToplevel();

  function next() {
    current += 1;
    return input[current];
  }

  function peek() {
    return input[current] || null;
  }

  function lookahead(i = 1) {
    return input[current + i] || null;
  }

  function eof() {
    const tok = peek();
    return tok && tok.type == "EOF";
  }

  function isPunc(ch) {
    let tok = peek();
    return tok && tok.type == "Punctuation" && (!ch || tok.value === ch) && tok;
  }

  function isOperator(op) {
    let tok = peek();
    return tok && tok.type === "Operator" && (!op || tok.value === op) && tok;
  }

  function isKeyword(kw) {
    let tok = peek();
    return tok && tok.type == "Keyword" && (!kw || tok.value == kw) && tok;
  }

  function skipPunc(ch) {
    if (isPunc(ch)) {
      next();
    } else {
      throw new NyxInputError(`Expecting punctuation: ${ch}`);
    }
  }

  function skipKw(kw) {
    if (isKeyword(kw)) {
      next();
    } else {
      throw new NyxInputError(`Expecting keyword: ${kw}`);
    }
  }

  function delimited(start, stop, separator, parser) {
    let arr = [];
    let first = true;
    skipPunc(start);
    while (!eof()) {
      if (isPunc(stop)) {
        break;
      }
      if (first) {
        first = false;
      } else {
        skipPunc(separator);
      }
      if (isPunc(stop)) {
        break;
      }
      arr.push(parser());
    }
    skipPunc(stop);
    return arr;
  }

  function maybeCall(expr) {
    expr = expr();
    return isPunc("(") ? parseCall(expr) : expr;
  }

  function maybeBinary(left, myPrec, sequence = null) {
    let tok = isOperator();
    if (!sequence && tok) {
      let hisPrec = PRECEDENCE[tok.value];
      if (hisPrec > myPrec) {
        next();
        return maybeBinary(
          {
            type: tok.value == "=" ? "Assignment" : "BinaryOperation",
            operator: tok.value,
            left,
            right: maybeBinary(parseExpression(), hisPrec),
            line: left.line,
            col: left.col,
          },
          myPrec
        );
      }
    }
    return left;
  }

  function parseUnary() {
    const tok = peek();
    next();
    return {
      type: "UnaryOperation",
      operator: tok.value,
      operand: parseAtom(),
      line: tok.line,
      col: tok.col,
    };
  }

  function parseKeyword() {
    const tok = peek();
    switch (tok.value) {
      case "true":
      case "false":
        return {
          type: "Boolean",
          value: tok.value,
          line: tok.line,
          col: tok.col,
        };

      case "nil":
        return {
          type: "Nil",
          value: null,
          line: tok.line,
          col: tok.col,
        };

      case "let":
        return parseVariableDefinition();

      case "const":
        return parseConstantDefinition();

      case "do":
        skipKw("do");
        return parseBlock();
    }
  }

  function parseVariableDefinition() {
    let tok = lookahead();
    let exp = null;
    if (lookahead(2) && lookahead(2).value == ",") {
      next();
      exp = parseExpression();
    }
    if (exp && exp.left && exp.left.type == "SequenceExpression") {
      return {
        type: "VariableParallelDefinition",
        names: exp.left,
        values: exp.right || null,
        line: exp.line,
        col: exp.col,
      };
    } else if (exp && exp.type == "SequenceExpression") {
      return {
        type: "VariableParallelDefinition",
        names: exp.expressions,
        line: exp.line,
        col: exp.col,
      };
    }
    return {
      type: "VariableDefinition",
      name: tok.value,
      line: tok.line,
      col: tok.col,
    };
  }

  function parseConstantDefinition() {
    const tok = next();
    const value = parseExpression();

    if (value.left && value.left.type == "SequenceExpression") {
      return {
        type: "ConstantParallelDefinition",
        names: value.left.expressions,
        values: value.right.expressions,
        line: value.line,
        col: value.col,
      };
    }
    return {
      type: "ConstantDefinition",
      name: tok.value,
      value,
      line: tok.line,
      col: tok.col,
    };
  }

  function parseSequenceExpression(first, sequence) {
    let expressions = sequence || [];
    let tok = peek();

    expressions.push(first);

    if (tok && tok.value == ",") {
      skipPunc(",");
      return parseExpression(expressions);
    }
    let seq = {
      type: "SequenceExpression",
      expressions,
      line: expressions[0].line,
      col: expressions[0].col,
    };
    return maybeBinary(seq, 0);
  }

  function parseCall(func) {
    let params = delimited("(", ")", ",", parseExpression);
    if (params[0] && params[0].expressions) {
      params = params[0].expressions;
    }
    return {
      type: "CallExpression",
      func,
      args: params,
    };
  }

  function parseMemberExpression(object) {
    skipPunc(".");
    let property = parseExpression();

    if (property && property.type == "CallExpression") {
      args = property.args;
      property = property.func;
      const callExpression = {
        type: "CallExpression",
        func: {
          type: "MemberExpression",
          object,
          property,
          line: object.line,
          col: object.col,
        },
        args,
      };
      return callExpression;
    }
    const memberExpression = {
      type: "MemberExpression",
      object,
      property,
      line: object.line,
      col: object.col,
    };
    return memberExpression;
  }

  function parseBlock() {
    let tok = peek();
    tok = next();
    let exprs = [];
    while (tok && tok.type != "Dedent") {
      if (tok && tok.type == "EOF") {
        throw new NyxInputError(
          "A block must be closed with an unindented newline"
        );
      }
      exprs.push(parseExpression());
      if (isKeyword("let")) {
        tok = next();
      } else {
        tok = peek();
      }
    }
    next();
    return {
      type: "Block",
      block: exprs,
      line: exprs[0].line,
      col: exprs[0].col,
    };
  }

  function parseAtom() {
    let tok = peek();

    return maybeCall(function () {
      if (isPunc("(")) {
        next();
        let exp = parseExpression();
        skipPunc(")");
        return exp;
      }

      if (tok && isOperator(tok.value)) {
        return parseUnary();
      }

      if (tok && isKeyword(tok.value)) {
        return parseKeyword();
      }

      if (tok && tok.type === "Decimal") {
        next();
        return tok;
      }

      if (tok && tok.type === "Identifier") {
        next();
        return {
          type: "Identifier",
          name: tok.value,
          line: tok.line,
          col: tok.col,
        };
      }
      throw new Error(`Token of type ${tok.type} not recognized`);
    });
  }

  function parseToplevel() {
    let program = [];
    while (peek() && peek().type !== "EOF") {
      program.push(parseExpression());
      next();
    }
    return { type: "Block", block: program };
  }

  function parseExpression(sequence = null) {
    const exp = maybeCall(() => maybeBinary(parseAtom(), 0, sequence));
    let tok = peek();
    if (sequence || (tok && tok.value == ",")) {
      return parseSequenceExpression(exp, sequence);
    }

    if (tok && tok.value == ".") {
      return parseMemberExpression(exp);
    }

    return exp;
  }
}

module.exports = parse;
