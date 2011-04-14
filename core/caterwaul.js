// Caterwaul JS | Spencer Tipping
// Licensed under the terms of the MIT source code license

(function (f) {return f(f, (function (x) {return function () {return ++x}})(1))}) (function (self, unique, undefined) {

// Introduction.
// Caterwaul implements a very small Lisp in Javascript syntax. The syntax ends up looking much more like McCarthy's M-expressions than traditional S-expressions, due to the ease of embedding
// those in a JS-compatible grammar. Also, Javascript convention makes square-bracket calls such as qs[foo] relatively uncommon, so I'm using that as the macro syntax (though of course you can
// define macros with other forms as well).

// The most important thing Caterwaul does is provide a quotation operator. For example:

// | caterwaul.clone('std')(function () {
//     return qs[x + 1];
//   });

// This function returns a syntax tree representing the expression 'x + 1'. Caterwaul also includes macro-definition and quasiquoting (not quite like Lisp, though I imagine you could write a
// macro for that):

// | caterwaul.configure('std')(function () {
//     caterwaul.macro(qs[let (_ = _) in _], function (variable, value, expression) {
//       return qs[(function (variable) {return expression}).call(this, value)].replace({variable: variable, expression: expression, value: value});
//     });
//     // Macro usable in future caterwaul()ed functions
//   });

// Or, more concisely (since macro definitions can be used inside other macro definitions when you define with rmacro):

// | var f = caterwaul.configure('std')(function () {
//     caterwaul.rmacro(qs[let (_ = _) in _], fn[variable, value, expression]
//                                              [qs[(fn[variable][expression]).call(this, value)].replace({variable: variable, expression: expression, value: value})]);
//   });

// Note that 'caterwaul' inside a transformed function refers to the transforming function, not to the global Caterwaul function.

// See the 'Macroexpansion' section some distance below for more information about defining macros.

//   Coding style.
//   I like to code using syntactic minimalism, and since this project is a hobby instead of work I've run with that style completely. This has some advantages and some disadvantages. Advantages
//   include (1) a very small gzipped/minified footprint (especially since these comments make up most of the file), (2) few lines of code, though they are very long, and (3) lots of semantic
//   factoring that should make modification relatively simple. Disadvantages are (1) completely impenetrable logic (especially without the comments) and (2) possibly suboptimal performance in
//   the small scale (depending on whether your JS interpreter is optimized for statements or expressions).

//   There are a couple of things worth knowing about as you're reading through this code. One is that invariants are generally coded as such; for example, the 'own' property lookup is factored
//   out of the 'has' function even though it would be trivial to write it inside. This is to indicate to Javascript that Object.prototype.hasOwnProperty is relatively invariant, and that saves
//   some lookups as the code is running. Another is that I use the (function (variable) {return expression})(value) form to emulate let-bindings. (Reading the code with this in mind will make it
//   much more obvious what's going on.)

//   Global management.
//   Caterwaul creates a global symbol, caterwaul. Like jQuery, there's a mechanism to get the original one back if you don't want to replace it. You can call caterwaul.deglobalize() to return
//   caterwaul and restore the global that was there when Caterwaul was loaded (might be useful in the unlikely event that someone else named their library Caterwaul). Note that deglobalize() is
//   available only on the global caterwaul() function. It wouldn't make much sense for clones to inherit it.

  var _caterwaul = typeof caterwaul === 'undefined' ? undefined : caterwaul;

- pinclude pp::js::core/caterwaul.utilities
- pinclude pp::js::core/caterwaul.tree
- pinclude pp::js::core/caterwaul.parser
- pinclude pp::js::core/caterwaul.compiler
- pinclude pp::js::core/caterwaul.macroexpander
- pinclude pp::js::core/caterwaul.configuration
- pinclude pp::js::core/caterwaul.behaviors

  var caterwaul_global = caterwaul = caterwaul_core(merge(replica(), {deglobalize: function () {caterwaul = _caterwaul; return this}}));
  return caterwaul_global});
// Generated by SDoc 
