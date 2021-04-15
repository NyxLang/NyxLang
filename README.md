# Nyx Programming Language

This is the canonical implementation of the Nyx programming language. Its behavior should be considered canonical until a working language specification is defined.

## About Nyx

Nyx is a hybrid functional and object-oriented programming language that basically takes what the maintainer (Jason Barr, jason@jasonsbarr.com) thinks are the best parts of various languages, including Python, Ruby, Swift, Elm, ReasonML, and Racket, puts them in a cup, shakes it, and then pours it out to see what happens.

## Disclaimer

**EVERYTHING IS IN FLUX.** I basically started writing an interpreter to see if I could make certain things work (e.g. syntactically-significant whitespace), and then at some point I decided to rewrite things and think more about what exactly I wanted the language to be like. As long as this disclaimer is here, anything you try with this interpreter is just as likely to be broken as not. I'm basically learning about programming language implementation as I go, so this should be a fun adventure!

## Short-term TODO list
- [x] Start working on tests and documentation/tutorials (ongoing)
- [ ] Start working on a more formal specification
- [ ] Change variable definition keyword from `let` to `var`
- [ ] Add basic numeric operations for Decimal and Double types
- [ ] Implement additional numeric types (Fraction, Complex, possibly Integer?)
- [ ] Rewrite String class (work with grapheme clusters?) with additional functional interface
- [ ] Rewrite List class (extend native JS Array) with additional functional interface
- [ ] Refine definitions of tokens and AST nodes
- [ ] Include file, code, and start/end positions in tokens and AST nodes
- [ ] Prevent creation of Newline and Indent/Dedent tokens when parens/brackets/braces are open
- [ ] Make splat operator work fully like JS spread (including spreading a List into a List)
- [ ] Build out numeric operations, functions, and methods
- [ ] Build out math functionality

## Longer-term TODO list
- Add Dictionary object with double splat operator
  - Include **kwargs capability for functions defined in-language
- Add immutable/persistent Records
- Add tuples with slicing?
- Add defining custom object types with composition and inheritance mechanisms
- Add semantic checking
  - Bindings and functions in namespaces
  - Type checking for bindings and functions
  - Subtyping and parametric polymorphism
  - LONGER-term: Type inference
- Add type aliasing
- Define modules and imports
- Enable interoperativity with JavaScript
- Build a real CLI interface with improvements to REPL
- Compile to JS
- In-language error handling
- Release interpreter as package
- Enable string interpolation and tagged template strings
- Implement block-scoping variables with `let`, as in Scheme
