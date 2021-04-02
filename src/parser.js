const Lexer = require("./lexer");
const stream = require("./input");
const { NyxInputError } = require("./errors");
const { exp, to } = require("mathjs");

// Binary operator precedence table
const PRECEDENCE = {
  "=": 3,
  "+=": 3,
  "-=": 3,
  "*=": 3,
  "/=": 3,
  "//=": 3,
  "%=": 3,
  or: 6,
  and: 7,
  "|": 8,
  "^": 9,
  "&": 10,
  "==": 11,
  "!=": 11,
  is: 11,
  "<": 12,
  ">": 12,
  "<=": 12,
  ">=": 12,
  in: 12,
  ">>": 13,
  "<<": 13,
  ">>>": 13,
  "+": 14,
  "-": 14,
  "*": 15,
  "/": 15,
  "//": 15,
  "%": 15,
  "**": 16,
  "->": 17,
};

function parse(input) {
  let current = 0;
  let saved = 0;

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

  function skipNewline(ch) {
    if (ch == "\n") {
      next();
    } else {
      throw new NyxInputError(`Expecting newline character`);
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
    return isPunc("(") ? maybeCall(() => parseCall(expr)) : expr;
  }

  function maybeBinary(left, myPrec, sequence = null, notSeq = null) {
    let tok = isOperator();
    if (!sequence && tok) {
      if (tok.value == "->") {
        return parseShorthandLambda(left);
      }
      let hisPrec = PRECEDENCE[tok.value];
      if (hisPrec > myPrec) {
        next();
        return maybeBinary(
          {
            type:
              tok.value == "=" ||
              tok.value == "+=" ||
              tok.value == "-=" ||
              tok.value == "*=" ||
              tok.value == "/=" ||
              tok.value == "//=" ||
              tok.value == "%="
                ? "Assignment"
                : "BinaryOperation",
            operator: tok.value,
            left,
            right: maybeBinary(
              parseExpression(sequence, notSeq),
              hisPrec,
              sequence,
              notSeq
            ),
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
        next();
        return {
          type: "Boolean",
          value: tok.value == "true",
          line: tok.line,
          col: tok.col,
        };

      case "nil":
        next();
        return {
          type: "Nil",
          value: null,
          line: tok.line,
          col: tok.col,
        };

      case "let":
        return parseVariableDefinition();

      case "do":
        skipKw("do");
        return parseBlock();

      case "if":
        return parseIf();

      case "unless":
        return parseUnless();

      case "while":
        return parseWhile();

      case "until":
        return parseUntil();

      case "for":
        return parseFor();

      case "def":
        return parseFunctionDefinition();

      case "lambda":
        return parseLambda();

      case "break":
      case "continue":
        skipKw(tok.value);
        return {
          type: "ControlStatement",
          value: tok.value,
          line: tok.line,
          col: tok.line,
        };

      case "return":
        return parseReturn();
    }
  }

  function parseVariableDefinition() {
    const tok = peek();
    skipKw("let");
    let assignment = parseExpression();
    let node = {};
    if (assignment.left.type == "SequenceExpression") {
      node.type = "VariableParallelDefinition";
      node.names = assignment.left;
      node.values = assignment.right;
    } else if (assignment.left.type == "Identifier") {
      node.type = "VariableDefinition";
      node.name = assignment.left;
      node.value = assignment.right;
    } else {
      throw new Error(
        `Left side of assignment must be a name at (${tok.line}:${tok.col})`
      );
    }
    node.line = tok.line;
    node.col = tok.col;
    return node;
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
    let args = delimited("(", ")", ",", () => parseExpression(null, true));
    return {
      type: "CallExpression",
      func,
      args,
      line: func.line,
      col: func.col,
    };
  }

  function parseMemberExpression(exprs) {
    const last = exprs[exprs.length - 1];

    if (exprs.length == 1) {
      return last;
    }

    let exp = {};

    if (last.type == "Identifier") {
      exp.type = "MemberExpression";
      exp.object = parseMemberExpression(exprs.slice(0, exprs.length - 1));
      exp.property = last;
    } else if (last.type == "CallExpression") {
      exp.type = "CallExpression";
      exp.func = parseMemberExpression([
        ...exprs.slice(0, exprs.length - 1),
        last.func,
      ]);
      exp.args = last.args;
    } else if (last.type == "SliceExpression") {
      exp.type = "SliceExpression";
      exp.object = parseMemberExpression(exprs.slice(0, exprs.length - 1));
      exp.index = last.index;
    }
    exp.line = last.line;
    exp.col = last.col;

    return exp;
  }

  function parseBlock() {
    let tok = peek();
    const indentLevel = tok.value;
    let exprs = [];
    tok = next();
    while (
      (tok && tok.type != "Dedent") ||
      (tok.type == "Dedent" && tok.value >= indentLevel)
    ) {
      if (tok.value == "\n") {
        skipNewline("\n");
        tok = peek();
      }
      exprs.push(parseExpression());
      if (isKeyword("let")) {
        tok = next();
      } else {
        tok = peek();
      }
    }
    let exp = {
      type: "Block",
      block: exprs,
      line: exprs[0].line,
      col: exprs[0].col,
    };

    if (tok && tok.type == "Dedent") {
      next();
    }
    return exp;
  }

  function parseIf(exp = null) {
    let tok = peek();
    skipKw("if");
    const cond = parseExpression();
    const then = exp || parseExpression();
    let expr = {
      type: "IfExpression",
      cond,
      then,
      line: tok.line,
      col: tok.col,
    };
    if (isKeyword("elseif")) {
      let elseifs = [];
      while (isKeyword("elseif")) {
        skipKw("elseif");
        elseifs.push({
          cond: parseExpression(),
          then: parseExpression(),
        });
      }
      expr.elseifs = elseifs;
    }
    if (isKeyword("else")) {
      skipKw("else");
      expr.else = parseExpression();
    }
    return expr;
  }

  function parseUnless(exp = null) {
    const tok = peek();
    skipKw("unless");
    const cond = parseExpression();
    const then = exp || parseExpression();
    let expr = {
      type: "UnlessExpression",
      cond,
      then,
      line: tok.line,
      col: tok.col,
    };
    if (isKeyword("else")) {
      skipKw("else");
      expr.else = parseExpression();
    }
    return expr;
  }

  function parseWhile(exp = null) {
    const tok = peek();
    skipKw("while");
    const cond = parseExpression();
    const body = exp || parseExpression();
    let expr = {
      type: "WhileStatement",
      cond,
      body,
      line: tok.line,
      col: tok.col,
    };
    return expr;
  }

  function parseUntil() {
    const tok = peek();
    skipKw("until");
    const cond = parseExpression();
    const body = parseExpression();
    let expr = {
      type: "UntilStatement",
      cond,
      body,
      line: tok.line,
      col: tok.col,
    };
    return expr;
  }

  function parseFor() {
    const tok = peek();
    skipKw("for");
    const vars = parseExpression();
    const body = parseExpression();
    const parsed = {
      type: "ForStatement",
      vars,
      body,
      line: tok.line,
      col: tok.col,
    };
    return parsed;
  }

  function parseFunctionDefinition() {
    const tok = peek();
    skipKw("def");
    const name = parseAtom();
    let expr = {
      type: "FunctionDefinition",
      name: name.func.name,
      params: name.args,
      line: tok.line,
      col: tok.col,
    };
    const body = parseExpression();
    if (body.type != "Block") {
      throw new Error("Function body must be a block");
    }
    expr.body = body;
    return expr;
  }

  function parseLambda() {
    let tok = peek();
    skipKw("lambda");
    skipPunc("(");
    let expr = {
      type: "LambdaExpression",
      line: tok.line,
      col: tok.col,
    };
    tok = peek();
    let args = tok && tok.type != "Punctuation" ? parseExpression() : [];
    if (args && args.type == "SequenceExpression") {
      args = args.expressions;
    } else if (args && args.type == "Identifier") {
      args = [args];
    }
    skipPunc(")");
    let body = parseExpression(null, true);
    expr.params = args;
    expr.body = body;
    return expr;
  }

  function parseReturn() {
    let tok = peek();
    skipKw("return");
    let expr = {
      type: "ReturnStatement",
      value: parseExpression(),
      line: tok.line,
      col: tok.col,
    };
    return expr;
  }

  function parseShorthandLambda(left) {
    let params;
    let expr = {
      type: "LambdaExpression",
      line: left.line,
      col: left.col,
    };
    if (left && left.type == "SequenceExpression") {
      params = left.expressions;
    } else if (left && left.type == "Nil") {
      params = [];
    } else {
      // has a single param, not a sequence
      params = [left];
    }
    next(); // skip current -> operator
    let body = parseExpression(null, true);
    expr.params = params;
    expr.body = body;
    return expr;
  }

  function parseList() {
    let tok = peek();
    return {
      type: "List",
      value: delimited("[", "]", ",", () => parseExpression(null, true)),
      line: tok.line,
      col: tok.col,
    };
  }

  function parseSlice(object) {
    let exp = {
      type: "SliceExpression",
      object,
      line: object.line,
      col: object.col,
    };
    skipPunc("[");
    const index = parseExpression();
    skipPunc("]");
    exp.index = index;
    return exp;
  }

  function parseAtom() {
    let tok = peek();

    return maybeCall(function () {
      if (isPunc("(")) {
        tok = next();
        if (tok && tok.value == ")") {
          // empty parentheses, should be shorthand lambda with no params
          skipPunc(")");
          return {
            type: "Nil",
            value: null,
            line: tok.line,
            col: tok.col,
          };
        }
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

      if (tok && tok.value == "[") {
        return parseList();
      }

      if (tok && tok.type === "Decimal") {
        next();
        return tok;
      }

      if (tok && tok.type === "String") {
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

      if (tok && tok.type === "Indent") {
        return parseBlock();
      }

      if (tok && tok.type === "Newline") {
        skipNewline(tok.value);
        return;
      }

      throw new Error(`Syntax Error: ${tok.value} not valid`);
    });
  }

  function parseToplevel() {
    let program = [];
    let tok = peek();
    while (!eof()) {
      if (tok && tok.type == "EOF") {
        break;
      }
      let exp = parseExpression();
      if (exp) {
        program.push(exp);
      }
      tok = peek();
      if (tok && tok.type == "Newline") {
        skipNewline(tok.value);
      }
    }
    return { type: "Program", program };
  }

  function parseExpression(sequence = null, notSeq = null) {
    const exp = maybeCall(() => maybeBinary(parseAtom(), 0, sequence, notSeq));
    let tok = peek();
    if ((sequence && !notSeq) || (tok && tok.value == "," && !notSeq)) {
      return parseSequenceExpression(exp, sequence);
    }

    if (tok && (tok.value == "." || tok.value == "[")) {
      let memberExprs = [];
      if (tok.value == ".") {
        memberExprs.push(exp);
      } else if (tok.value == "[") {
        memberExprs.push(maybeCall(() => parseSlice(exp)));
        tok = peek();
      }
      while (tok.value == "." || tok.value == "[") {
        if (tok.value == ".") {
          skipPunc(".");
          memberExprs.push(parseAtom());
        } else if (tok.value == "[") {
          memberExprs.push(
            maybeCall(() => parseSlice(memberExprs[memberExprs.length - 1]))
          );
        }
        tok = peek();
      }
      return maybeCall(() =>
        maybeBinary(parseMemberExpression(memberExprs), 0)
      );
    }

    if (tok && tok.value == "if") {
      saved = current;
      skipKw("if");
      parseExpression();
      if (peek() && peek().value == "\n") {
        current = saved;
        return parseIf(exp);
      } else if (isKeyword("else")) {
        skipKw("else");
        parseExpression();
        if (peek() && peek().value == "\n") {
          current = saved;
          return parseIf(exp);
        }
      } else {
        current = saved;
      }
    }

    if (tok && tok.value == "unless") {
      saved = current;
      skipKw("unless");
      parseExpression();
      if (peek() && peek().value == "\n") {
        current = saved;
        return parseUnless(exp);
      } else if (isKeyword("else")) {
        skipKw("else");
        parseExpression();
        if (peek() && peek().value == "\n") {
          current = saved;
          return parseUnless(exp);
        }
      } else {
        current = saved;
      }
    }

    return exp;
  }
}

module.exports = parse;
