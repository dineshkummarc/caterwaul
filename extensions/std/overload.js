// Operator overloading support | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// This gives you a simple way to overload operators in Javascript. Each operator invocation is translated into a method call on the left-hand operand (or the only operand in the case of unary
// operators). This is done by introducing a new modifier called 'overload'. For example:

// | overload in x + y     ->    x['+'](y)

// Unary operators are encoded like this:

// | overload in -x        ->    x['u-']()

// The following operators are overloaded when you use this modifier:

// | new void in instanceof typeof
//   u! u+ u- u~
//   + - * / % ^ | & << >> >>>
//   += -= *= /= %= ^= |= &= <<= >>= >>>=
//   == != === !== < > <= >=

// Notably not overloaded are function calls and dots/brackets. The reason for this is that it breaks idempotence; overloading the same expression twice would yield a different result. Also not
// overloaded are &&, ||, or ?:; these could be meaningfully overloaded but their evaluation semantics would be lost.

caterwaul.js_base()(function ($) {
  var map = function (xs, f) {for (var ys = [], i = 0, l = xs.length; i < l; ++i) ys.push(f(xs[i])); return ys};

  $.overload_macro(language) = language.modifier('overload', this.expand(overload_expand(tree._expression)) -given.tree -where [overload_expand = $.overload()]),
  $.overload()               = $.clone().macros(unary_operators, binary_operators),

  where [overload_unary(op)  = $.macro('#{op} _x',    '_x["#{/[a-z]/.test(op) ? op : "u" + op}"]()'),
         overload_binary(op) = $.macro('_x #{op} _y', '_x["#{op}"](_y)'),

         qw(s)               = s.split(/\s+/),
         unary_operators     = map(qw('! ~ + - new void typeof'),                                                                              overload_unary),
         binary_operators    = map(qw('+ - * / % ^ | & << >> >>> += -= *= /= %= ^= |= &= <<= >>= >>>= == != === !== < > <= >= in instanceof'), overload_binary)]})(caterwaul);

// Generated by SDoc 
