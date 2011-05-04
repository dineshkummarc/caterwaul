// Caterwaul standard library | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Internal libraries.
// These operate on caterwaul in some way, but don't necessarily have an effect on generated code.



// Symbol anonymization | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// A recurring pattern in previous versions of caterwaul was to clone the global caterwaul function and set it up as a DSL processor by defining a macro that manually dictated tree traversal
// semantics. This was often difficult to implement because any context had to be encoded bottom-up and in terms of searching rather than top-down inference. This library tries to solve the
// problem by implementing a grammar-like structure for tree traversal.

//   Use cases.
//   One fairly obvious use case is code tracing. When we trace some code, we need to keep track of whether it should be interpreted in sequence or expression context. Although there are only two
//   states here, it still is too complex for a single-layer macroexpander to handle gracefully; so we create two separate caterwaul functions that delegate control to one another. We then create
//   a set of annotations to indicate which state or states should be chosen next. For example, here are some expansions from the tracing behavior:

//   | E[_x = _y]  ->  H[_x = E[_y]]
//     S[_x = _y]  ->  _x = E[_y]

//   It's straightforward enough to define macros this way; all that needs to be done is to mark the initial state and put state information into the macro patterns. The hard part is making sure
//   that the markers don't interfere with the existing syntax. This requires that all of the markers be replaced by gensyms before the macroexpansion happens.

//   Gensym anonymizing.
//   Replacing symbols in macro patterns is trivial with the replace() method. The only hard part is performing this same substitution on the macroexpansions. (In fact, this is impossible to do
//   transparently given Turing-complete macros.) In order to work around this, strings are automatically expanded (because it's easy to do), but functions must call translate_state_markers() on
//   any patterns they intend to use. This call must happen before substituting syntax into the patterns (!) because otherwise translate_state_markers() may rewrite code that happens to contain
//   markers, thus reintroducing the collision problem that all of this renaming is intended to avoid.

// Usage.
// To anonymize a set of macros you first need to create an anonymizer. This is easy; you just give it a list of symbols to anonymize and then use that anonymizer to transform a series of macros
// (this process is non-destructive):

// | var anonymize = caterwaul.anonymizer('X', 'Y', 'Z');
//   var m = caterwaul.macro(anonymize('X[foo]'), ...);    // Matches against gensym_1_aj49Az0_885nr1q[foo]

// Each anonymizer uses a separate symbol table. This means that two anonymizers that match against 'A' (or any other macro pattern) will always map them to different gensyms.

(function ($) {$.anonymizer = function () {for (var translation_table = {}, i = 0, l = arguments.length; i < l; ++i) translation_table[arguments[i]] = $.gensym();
                                           return function (node) {return node.replace(translation_table)}}})(caterwaul);
// Generated by SDoc 




// Language specializations.
// These provide configurations that specialize caterwaul to operate well with a given programming language. This is relevant because not all languages compile to Javascript the same way, and
// caterwaul should be able to adapt to the syntactic limitations of generated code (and thus be usable with non-Javascript languages like Coffeescript).

// Also included is a standard set of words that can be combined with the Javascript forms to produce useful macros. Together these form a base language that is used by other parts of the
// standard library.



// Common adjectives and adverbs | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// This behavior installs a bunch of common words and sensible behaviors for them. The goal is to handle most Javascript syntactic cases by using words rather than Javascript primitive syntax.
// For example, constructing lambdas can be done with 'given' rather than the normal function() construct:

// | [1, 2, 3].map(x + 1, given[x])        // -> [1, 2, 3].map(function (x) {return x + 1})

// In this case, given[] is registered as a postfix binary adverb. Any postfix binary adverb forms added later will extend the possible uses of given[].

(function ($) {
  var loop_anon = $.anonymizer('i', 'l', 'xs', 'result');
  $.word_macros = function (language) {
    return [

// Quotation.
// qs[] comes from pre-1.0 caterwaul; this lets you quote a piece of syntax, just like quote in Lisp. The idea is that qs[something] returns 'something' as a syntax tree. qse[] is a variant that
// macroexpands the syntax tree before returning it; this used to be there for performance reasons (now irrelevant with the introduction of precompilation) but is also useful for macro reuse.

  language.modifier('qs',  function (match) {return new $.ref(match._expression)}),
  language.modifier('qse', function (match) {return new $.ref(this.expand(match._expression))}),

// Scoping and referencing.
// These all impact scope or references somehow -- in other words, they create variable references but don't otherwise impact the nature of evaluation.

//   Function words.
//   These define functions in some form. given[] and bgiven[] are postfix adverbs to turn an expression into a function; given[] creates a regular closure while bgiven[] preserves the closure
//   binding. They're aliased to the more concise fn[] and fb[] for historical and ergonomic reasons. For example:

//   | var f = fn[x] in x + 1
//     var f = x + 1 |given[x];
//     var f = x + 1 |given.x;

    language.parameterized_modifier('given',  'from',  'fn', '(function (_modifiers) {return _expression})'),
    language.parameterized_modifier('bgiven', 'bfrom', 'fb', '(function (t, f) {return (function () {return f.apply(t, arguments)})})(this, (function (_modifiers) {return _expression}))'),

//   Side-effecting.
//   The goal here is to take an existing value, modify it somehow, and then return it without allocating an actual variable. This can be done using the /effect[] adverb, also written as /se[].
//   Older versions of caterwaul bound the variable as _; version 1.0 changes this convention to bind the variable to 'it'. For example:

//   | hash(k, v) = {} /effect[it[k] = v];
//     compose(f, g)(x) = g(x) -then- f(it);

    language.parameterized_modifier('effect', 'se',              '(function (it) {return (_modifiers), it}).call(this, (_expression))'),
    language.parameterized_modifier('then',   're', 'returning', '(function (it) {return (_modifiers)}).call(this, (_expression))'),

//   Scoping.
//   You can create local variables by using the where[] and bind[] adverbs. If you do this, the locals can all see each other since they're placed into a 'var' statement. For example:

//   | where[x = 10][alert(x)]
//     alert(x), where[x = 10]
//     bind[f(x) = x + 1] in alert(f(10))

    language.parameterized_modifier('where', 'bind', '(function () {var _modifiers; return (_expression)}).call(this)'),

// Control flow modifiers.
// These impact how something gets evaluated.

//   Conditionals.
//   These impact whether an expression gets evaluated. x /when[y] evaluates to x when y is true, and y when y is false. Similarly, x /unless[y] evaluates to x when y is false, and !y when y is
//   true. A final option 'otherwise' is like || but can have different precedence:

//   | x = x /otherwise.y + z;

    language.parameterized_modifier('when',      '((_modifiers) && (_expression))'),
    language.parameterized_modifier('unless',    '(! (_modifiers) && (_expression))'),
    language.parameterized_modifier('otherwise', '((_expression) || (_modifiers))'),

    language.parameterized_modifier('when_defined',   '((_modifiers) != null && (_expression))'),
    language.parameterized_modifier('unless_defined', '((_modifiers) == null && (_expression))'),

//   Collection-based loops.
//   These are compact postfix forms of common looping constructs. Rather than assuming a side-effect, each modifier returns an array of the results of the expression.

//   | console.log(it), over[[1, 2, 3]]            // logs 1, then 2, then 3
//     console.log(it), over_keys[{foo: 'bar'}]    // logs foo
//     console.log(it), over_values[{foo: 'bar'}]  // logs bar


    language.parameterized_modifier('over',        loop_anon('(function () {for (var xs = (_modifiers), result = [], i = 0, l = xs.length, it; i < l; ++i)' +
                                                               'it = xs[i], result.push(_expression); return result}).call(this)')),

    language.parameterized_modifier('over_keys',   loop_anon('(function () {var x = (_modifiers), result = []; ' +
                                                               'for (var it in x) Object.prototype.hasOwnProperty.call(x, it) && result.push(_expression); return result}).call(this)')),

    language.parameterized_modifier('over_values', loop_anon('(function () {var x = (_modifiers), result = [], it; ' +
                                                               'for (var k in x) Object.prototype.hasOwnProperty.call(x, k) && (it = x[k], result.push(_expression));' +
                                                               'return result}).call(this)')),

//   Condition-based loops.
//   These iterate until something is true or false, collecting the results of the expression and returning them as an array. For example:

//   | console.log(x), until[++x >= 10], where[x = 0]      // logs 1, 2, 3, 4, 5, 6, 7, 8, 9

    language.parameterized_modifier('until', loop_anon('(function () {var result = []; while (! (_modifiers)) result.push(_expression); return result}).call(this)'))]}})(caterwaul);
// Generated by SDoc 





// Javascript-specific macros | Spencer Tipping
// Licensed under the terms of the MIT source code license

(function ($) {

// Structured forms in Javascript.
// These aren't macros, but forms. Each language has its own ways of expressing certain idioms; in Javascript we can set up some sensible defaults to make macros more consistent. For example,
// caterwaul pre-1.0 had the problem of wildly divergent macros. The fn[] macro was always prefix and required parameters, whereas /se[] was always postfix and had a single optional parameter.
// /cps[] was similarly postfix, which was especially inappropriate considering that it could theoretically handle multiple parameters.

// In caterwaul 1.0, the macro author's job is reduced to specifying which words have which behavior; the language driver takes care of the rest. For instance, rather than specifying the full
// pattern syntax, you just specify a word and its definition with respect to an opaque expression and perhaps set of modifiers. Here are the standard Javascript macro forms:

  var macro  = function (template) {return $.macro      ($.parse(template).replace({_modifier: $.parse(name)}), expander)};
  var macros = function (template) {return $.js_modifier($.parse(template).replace({_modifier: $.parse(name)}), expander)};

  $.js = {modifier:               $.right_variadic(function (name, expander) {return
                                    $.map(macro, ['_expression /_modifier', '_expression -_modifier', '_expression |_modifier', '_expression._modifier',
                                                  '_modifier[_expression]', '_modifier in _expression'])}),

          parameterized_modifier: $.right_variadic(function (name, expander) {return
                                    [$.map(macros, ['_modifier[_parameters]', '_modifier._parameters']),
                                     $.map(macro,  ['_expression <_modifier> _parameters', '_expression -_modifier- _parameters'])]})};

// Javascript-specific shorthands.
// Javascript has some syntactic weaknesses that it's worth correcting. These don't relate to any structured macros, but are hacks designed to make JS easier to use.

  $.js.macros = [

//   Javascript intrinsic verbs.
//   These are things that you can do in statement mode but not expression mode.

    $.macro('wobbly[_x]', '(function () {throw _x}).call(this)'),

//   String interpolation.
//   Javascript normally doesn't have this, but it's straightforward enough to add. This macro implements Ruby-style interpolation; that is, "foo#{bar}" becomes "foo" + bar. A caveat (though not
//   bad one in my experience) is that single and double-quoted strings are treated identically. This is because Spidermonkey rewrites all strings to double-quoted form.

//   This version of string interpolation is considerably more sophisticated than the one implemented in prior versions of caterwaul. It still isn't possible to reuse the same quotation marks
//   used on the string itself, but you can now include balanced braces in the interpolated text. For example, this is now valid:

//   | 'foo #{{bar: "bif"}.bar}'

//   There are some caveats; if you have unbalanced braces (even in substrings), it will get confused and misread the boundary of your text. So stuff like this won't work properly:

//   | 'foo #{"{" + bar}'          // won't find the ending properly and will try to compile the closing brace

    function (node) {
      var s = node.data, q = s.charAt(0), parse = $.parse, syntax = $.syntax;
      if (q !== '\'' && q !== '"' || ! /#\{[^\}]+\}/.test(s)) return false;             // DeMorgan's applied to (! ((q === ' || q === ") && /.../test(s)))

      for (var pieces = [], i = 1, l = s.length - 1, brace_depth = 0, got_hash = false, start = 1, c; i < l; ++i)
        if (brace_depth) if ((c = s.charAt(i)) === '}') --brace_depth || pieces.push(s.substring(start, i)) && (start = i + 1), got_hash = false;
                    else                                brace_depth += c === '{';
   else                  if ((c = s.charAt(i)) === '#') got_hash = true;
                    else if (c === '{' && got_hash)     pieces.push(s.substring(start, i - 1)), start = i + 1, ++brace_depth;
                    else                                got_hash = false;

      pieces.push(s.substring(start, l));

      for (var escaped = new RegExp('\\\\' + q, 'g'), i = 0, l = pieces.length; i < l; ++i) pieces[i] = i & 1 ? parse(pieces[i].replace(escaped, q)).as('(') :
                                                                                                                new syntax(q + pieces[i] + q);
      return new syntax('+', pieces).unflatten().as('(')},

//   Destructuring function creation.
//   This is a beautiful hack made possible by Internet Explorer. We can intercept cases of assigning into a function and rewrite them to create a function body. For example, f(x) = y becomes the
//   regular assignment f = function (x) {return y}. Because this macro is repeatedly applied we get currying for free.

//   There's a special case. You can grab the whole arguments array by setting something equal to it. For example, f(xs = arguments) = xs[0] + xs[1]. This makes it easy to use binding constructs
//   inside the body of the function without worrying whether you'll lose the function context.

    $.macro('_left(_args) = _right',            '_left = (function (_args) {return _right})'),
    $.macro('_left(_var = arguments) = _right', '_left = (function () {var _var = arguments; return _right})')]})(caterwaul);
// Generated by SDoc 




  caterwaul.js.words       = caterwaul.word_macros(caterwaul.js);
  caterwaul.js.base        = caterwaul();
  caterwaul.js.base.macros = caterwaul.flatten(caterwaul.js.words, caterwaul.js.macros);

// Libraries.
// These apply more advanced syntactic transforms to the code and can depend on everything above.



// Inversion behavior | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// Enabling this behavior results in two interesting things. First, every function will be automatically annotated with an inverse, which is stored as a gensym-encoded attribute on the function.
// Second, the lvalue behavior will be extended to allow functional and expression destructuring. It isn't possible to assign into a complex expression in JS grammar, so only parameters can be
// bound this way.

// Inversion isn't guaranteed to be accurate in the general case. All it guarantees is that it is accurate under the function being inverted. That is, if f is an invertible function and fi is its
// inverse, then x === fi(f(x)) isn't true in general. However, f(x) === f(fi(f(x))) generally is.

// Combinatory inversion.
// Each kind of expression has certain inversion semantics. Some of them perform runtime type detection to figure out how best to invert something. For example, the + operator is overloaded
// across strings and numbers, so we have to do a type check on the arguments before knowing which inversion to use. Also, different cases are taken depending on which operand is a constant.
// (Most binary operators fail with two variables.)

// Information gets lost when you invert stuff, as most operators are closed within a finite type. For example, suppose x | 3 = 7. We now don't know the lowest two bits of x, so we arbitrarily
// set them to zero for the purposes of destructuring. (Also, if x | 3 = 6, we reject the match because we know something about the bits set by |.)

// Inversion never degenerates into nondeterminism. That is, ambiguous multivariate cases are rejected immediately rather than explored. So, for example, if f(x, y) = x + y, you can't match
// against f(x, y) and expect it to work. You could match against f(x, 1) or f(5, y), though, since once the constants are propagated through the expression you will end up with an unambiguous
// way to invert the + operator. In some cases nondeterminism is eliminated through default behavior: if f(x, y) = x && y, then matching against f(x, y) = X will result in x = true, y = X when X
// is truthy, and x = X, y = undefined when X is falsy. || behaves similarly; x || y = X results in x = X, y = undefined when X is true, and x = false, y = X when X is falsy.

// Constructor inversion.
// Constructors are a bizarre case of function application, and it's possible to invert them with some accuracy. Basically, we track the assignment of parameters into named 'this' properties and
// construct the inverse based on corresponding properties of the object being matched against. For example, the constructor fc[x, y][this.x = x, this.y = y] is invertible by pulling .x and .y
// from the object.

// Decisional inversion.
// This isn't a joke; it's actually possible to invert a decisional sometimes. However, it may end up taking every branch. The idea is that you try the first branch; if it succeeds, then we
// assume the condition variable was true and return. If it fails, then we try the second branch and assume that the condition variable was false. So, for example:

// | f(cond, x, y) = cond ? {foo: x} : {bar: y};
//   g(f(b, x, y)) = 'got ' + b + ' with ' + [x, y];
//   g({foo: 10})                  // returns 'got true with 10,undefined'
//   g({bar: 10})                  // returns 'got false with undefined,10'

// It's important to have decisional inversion because we might want to invert a pattern-matching function. For example:

// | foo('foo' + bar) = 'got a foo: ' + bar
//   foo('bif' + bar) = 'got a bif: ' + bar
//   g(foo(x)) = x
//   g('got a foo: bar')           // returns 'foobar'
//   g('got a bif: bar')           // returns 'bifbar'

// Recursive inversion.
// This also isn't a joke, though you can cause an infinite loop if you're not careful. You shouldn't really use this, but it's a natural side-effect of the way I'm representing inversions
// anyway. Here's an example:

// | power_of_two(n) = n === 0 ? 1 : 2 * power_of_two(n - 1);
//   g(power_of_two(x)) = x;
//   g(1)                  // -> 0
//   g(2)                  // -> 1
//   g(4)                  // -> 2

// Here's what the inverse function looks like (modulo formatting, error checking, etc):

// | power_of_two_inverse(x) = x === 1 ? {n: 0} : {n: 1 + power_of_two_inverse(x / 2).n};

// Don't use this feature! It's slow, it may infinite-loop, and it doesn't work for most recursive functions because of the nondeterminism limitation. I'm also not even going to guarantee that it
// works correctly in trivial cases like this, though if it doesn't it's probably because of a bug.
// Generated by SDoc 



// Generated by SDoc 