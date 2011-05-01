// Cod etrace behavior | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// The tracing configuration lets you create traces of code as it executes. It gives you a uniform interface to observe the evaluation of each expression in the program. To do this, first enable
// the 'trace' configuration, then add hooks. For example, here's a very simple profiler (it doesn't account for 'own time', just 'total time'):

// | var tracer  = caterwaul.clone('trace');
//   var timings = {};
//   var timers  = [];
//   tracer.trace.on_before_trace(timings[expression.id()] = timings[expression.id()] || 0, timers.push(+new Date()), given[expression]).
//                 on_after_trace(timings[expression.id()] += +new Date() - timers.pop(),                             given[expression, value]);
//   tracer(function () {...})();          // Annotations inserted during macroexpansion

// Interface details.
// Tracing things involves modifying the generated expressions in a specific way. First, the tracer marks that an expression will be evaluated. This is done by invoking a 'start' function, which
// then alerts all of the before-evaluation listeners. Then the tracer evaluates the original expression, capturing its output and alerting listeners in the process. Listeners are free to use
// and/or modify this value, but doing so may change how the program runs. (Note that value types are immutable, so in this case no modification will be possible.)

// There is currently no way to catch errors generated by the code. This requires a more aggressive and much slower method of tracing, and most external Javascript debuggers can give you a
// reasonable stack trace. (You can also deduce the error location by observing the discrepancy between before and after events.)

// Here is the basic transformation applied to the code:

// | some_expression   ->  (before_hook(qs[some_expression]), after_hook(qs[some_expression], some_expression))

// Note that the tracer inserts itself as an after-step in the compilation process. This means that if you have other after-configurations, you should think about whether you want them to operate
// on the traced or untraced code. If untraced, then you should configure caterwaul with those configurations first:

// | caterwaul.clone('X trace')    // X sees untraced code, then trace takes X's output
//   caterwaul.clone('trace X')    // X sees traced code, which is probably not what you want

// Note that because tracing uses syntax refs you can't precompile traced code. Normally you wouldn't want to anyway, but it will throw an error if you do.

// The hard part.
// If Javascript were any kind of sane language this module would be trivial to implement. Unfortunately, however, it is fairly challenging, primarily because of two factors. One is the role of
// statement-mode constructs, which can't be wrapped directly inside function calls. The other is method invocation binding, which requires either (1) no record of the value of the method itself,
// or (2) caching of the object. In this case I've written a special function to handle the caching to reduce the complexity of the generated code.

  caterwaul.self_eval(function (def) {
    this.attr_lazy('trace', function () {return this.global().tconfigure('core.js core.words core.quote', function () {

//   Setup.
//   This just involves creating the events and setting up the state markers.

    this.event('before_trace', 'after_trace'),
    this.state_marker(it) -over- qw('E S H D I'),

//   Expression-mode transformations.
//   Assuming that we're in expression context, here are the transforms that apply. Notationally, H[] means 'hook this', D[] means 'hook this direct method call', I[] means 'hook this indirect
//   method call', E[] means 'trace this expression recursively', and S[] means 'trace this statement recursively'. It's essentially a simple context-free grammar over tree expressions.

    this.method('assignment_operator', given.op in this.tmacro(qs[E[_x     = _y]].replace({'=': op}), qs[H[_, _x           = E[_y]]].replace({'=': op})).
                                                        tmacro(qs[E[_x[_y] = _z]].replace({'=': op}), qs[H[_, E[_x][E[_y]] = E[_z]]].replace({'=': op})).
                                                        tmacro(qs[E[_x._y  = _z]].replace({'=': op}), qs[H[_, E[_x]._y     = E[_z]]].replace({'=': op}))).
         method('binary_operator',     given.op in this.tmacro(qs[E[_x + _y]].replace({'+': op}), qs[H[_, E[_x] + E[_y]]].replace({'+': op}))).
         method('unary_operator',      given.op in this.tmacro(qs[E[+_x]].replace({'u+': 'u#{op}'}), qs[H[_, +T[_x]]].replace({'u+': 'u#{op}'}))),

    this.tmacro('E[]',   'null').                                                                                       // Base case: oops, descended into nullary something
         tmacro('E[_x]', 'H[_, _x]'),                                                                                   // Base case: identifier or literal

    this.assignment_operator(it) -over- qw('= += -= *= /= %= &= |= ^= <<= >>= >>>='),                                   // Use methods above to define these regular macros
    this.binary_operator(it)     -over- qw('() [] + - * / % < > <= >= == != === !== in instanceof ^ & | && ||'),
    this.unary_operator(it)      -over- qw('+ - ! ~'),

    this.tmacro('E[(_x)]', '(E[_x])').                                                                                  // Destructuring of parens
         tmacro('E[++_x]', 'H[_, ++_x]').tmacro('E[--_x]', 'H[_, --_x]').
         tmacro('E[_x++]', 'H[_, _x++]').tmacro('E[_x--]', 'H[_, _x--]').                                               // Increment/decrement (can't trace original value)

         tmacro('E[_x, _y]',                 'E[_x], E[_y]').                                                           // Preserve commas -- works in an argument list
         tmacro('E[_x._y]',                  'H[_, E[_x]._y]').                                                         // No tracing for constant attributes
         tmacro('E[_f()]',                   'H[_, E[_f]()]').                                                          // Nullary function call won't be handled by binary ()

         tmacro('E[_o._m(_xs)]',             'D[_, E[_o], _m, [E[_xs]]]').                                              // Use D[] to indicate direct method binding
         tmacro('E[_o[_m](_xs)]',            'I[_, E[_o], E[_m], [E[_xs]]]').                                           // Use I[] to indicate indirect method binding
         tmacro('E[_o._m()]',                'D[_, E[_o], _m, []').                                                     // Duplicate for nullary method calls
         tmacro('E[_o[_m]()]',               'I[_, E[_o], E[_m], []').

         tmacro('E[typeof _x]',              'H[_, typeof _x]').                                                        // No tracing for typeof since the value may not exist
         tmacro('E[void _x]',                'H[_, void E[_x]]').                                                       // Normal tracing
         tmacro('E[delete _x._y]',           'H[_, delete E[_x]._y]').                                                  // Lvalue, so no tracing for the original
         tmacro('E[new _x(_y)]',             'H[_, new H[_x](E[_y])]').                                                 // Hook the constructor to prevent method-handling from happening
         tmacro('E[{_ps}]',                  'H[_, {E[_ps]}]').                                                         // Hook the final object and distribute across k/v pairs (more)
         tmacro('E[_k: _v]',                 '_k: E[_v]').                                                              // Ignore keys (which are constant)
         tmacro('E[[_xs]]',                  'H[_, [E[_xs]]]').                                                         // Hook the final array and distribute across elements
         tmacro('E[_x ? _y : _z]',           'H[_, E[_x] ? E[_y] : E[_z]]').
         tmacro('E[function (_xs) {_body}]', 'H[_, function (_xs) {S[_body]}]').                                        // Trace body in statement mode rather than expression mode
         tmacro('E[function ()    {_body}]', 'H[_, function ()    {S[_body]}]'),                                        // Handle nullary case

//   Statement-mode transformations.
//   A lot of the time this will drop back into expression mode. However, there are a few cases where we need disambiguation. One is the var statement, where we can't hook the result of the
//   assignment. Another is the {} construct, which can be either a block or an object literal.

//   There's some interesting stuff going on with = and commas. The reason is that sometimes you have var definitions, and they contain = and , trees that can't be traced quite the same way that
//   they are in expressions. For example consider this:

//   | var x = 5, y = 6;

//   In this case we can't evaluate 'x = 5, y = 6' in expression context; if we did, it would produce H[x = H[5]], H[y = H[6]], and this is not valid Javascript within a var statement. Instead,
//   we have to produce x = H[5], y = H[6]. The statement-mode comma and equals rules do exactly that. Note that we don't lose anything by doing this because in statement context the result of an
//   assignment is never used anyway.

    this.tmacro('S[_x]',                         'E[_x]').                         tmacro('S[for (_x) _y]',                           'for (S[_x]) S[_y]').
         tmacro('S[{_x}]',                       '{S[_x]}').                       tmacro('S[for (_x; _y; _z) _body]',                'for (S[_x]; E[_y]; E[_z]) S[_body]').
         tmacro('S[_x; _y]',                     'S[_x]; S[_y]').                  tmacro('S[while (_x) _y]',                         'while (E[_x]) S[_y]').
                                                                                   tmacro('S[do _x; while (_y)]',                     'do S[_x]; while (E[_y])').
         tmacro('S[function _f(_args) {_body}]', 'function _f(_args) {S[_body]}'). tmacro('S[do {_x} while (_y)]',                    'do {S[_x]} while (E[_y])').
         tmacro('S[function _f()      {_body}]', 'function _f()      {S[_body]}').
         tmacro('S[_x, _y]',                     'S[_x], S[_y]').                  tmacro('S[try {_x} catch (_e) {_y}]',              'try {S[_x]} catch (_e) {S[_y]}').
         tmacro('S[_x = _y]',                    '_x = E[_y]').                    tmacro('S[try {_x} catch (_e) {_y} finally {_z}]', 'try {S[_x]} catch (_e) {S[_y]} finally {S[_z]}').
         tmacro('S[var _xs]',                    'var S[_xs]').                    tmacro('S[try {_x} finally {_y}]',                 'try {S[_x]} finally {S[_y]}').
         tmacro('S[const _xs]',                  'const S[_xs]').
                                                                                   tmacro('S[return _x]',                             'return E[_x]').
         tmacro('S[if (_x) _y]',                 'if (E[_x]) S[_y]').              tmacro('S[return]',                                'return').
         tmacro('S[if (_x) _y; else _z]',        'if (E[_x]) S[_y]; else S[_z]').  tmacro('S[throw _x]',                              'throw E[_x]').
         tmacro('S[if (_x) {_y} else _z]',       'if (E[_x]) {S[_y]} else S[_z]'). tmacro('S[break _label]',                          'break _label').
                                                                                   tmacro('S[break]',                                 'break').
         tmacro('S[switch (_c) {_body}]',        'switch (E[_c]) {S[_body]}').     tmacro('S[continue _label]',                       'continue _label').
         tmacro('S[with (_x) _y]',               'with (E[_x]) S[_y]').            tmacro('S[continue]',                              'continue').
                                                                                   tmacro('S[_label: _stuff]',                        '_label: S[_stuff]'),

//   Hook generation.
//   Most of the actual hook generation code is fairly routine for JIT stuff. The patterns here don't actually expand into other state marker patterns; H, D, and I are all terminal. The [1]
//   subscript is a hack. We want to grab the un-annotated tree, but all of the patterns have state markers on them. So we subscript by [1] to get the child of that state annotation.

    this.tmacro('H[_tree, _x]',                              given.match in this.expression_hook     (match._tree[1], match._x)).
         tmacro('D[_tree, _object, _method, [_parameters]]', given.match in this.direct_method_hook  (match._tree[1], match)).
         tmacro('I[_tree, _object, _method, [_parameters]]', given.match in this.indirect_method_hook(match._tree[1], match)),

//     Code generation.
//     These methods perform the tracing. Originally they were lexical closures over one another, but this failed due to cloning. The structure here is that the before_hook, after_hook, and
//     after_method_hook methods are called from inside the traced code through syntax refs that point to them.

      this.self_eval(function (def) {
        def('before_hook',                      given[tree]                             in this.before_trace(tree));
        def('after_hook',                       given[tree, value]                      in this.after_trace(tree, value) -returning- value);
        def('after_method_hook',                given[tree, object, method, parameters] in this.before_trace(tree[0]) -then- this.after_trace(tree[0], resolved) -then-
                                                                                           this.after_hook(tree, resolved.apply(object, parameters)) -where[resolved = object[method]]);

        this.attr_lazy('before_hook_ref',       given.nothing in new this.ref(this.before_hook));
        this.attr_lazy('after_hook_ref',        given.nothing in new this.ref(this.after_hook));
        this.attr_lazy('after_method_hook_ref', given.nothing in new this.ref(this.after_method_hook));

        def('quote_method_name',                given.method in '"#{method.data.replace(/"/g, "\\\"")}"');

        def('expression_hook_template',         qs[_before_hook(_tree), _after_hook(_tree, _expression)].as('('));
        def('indirect_method_hook_template',    qs[_before_hook(_tree), _after_hook(_tree, _object, _method, [_parameters])].as('('));

        def('expression_hook',                  given[original, tree] in this.expression_hook_template.replace({_before_hook: this.before_hook_ref(), _after_hook: this.after_hook_ref(),
                                                                                                                _tree: new this.ref(original), _expression: tree.as('(')}));

        def('method_hook',                      given[tree, object, method, parameters] in
                                                  this.indirect_method_hook_template.replace({_before_hook: this.before_hook_ref(), _after_hook: this.after_method_hook_ref(),
                                                                                              _tree: new this.ref(tree), _object: object, _method: method, _parameters: parameters}));

        def('direct_method_hook',               this.method_hook(tree, match._object, this.quote_method_name(match._method), match._parameters) -given[tree, match]);
        def('indirect_method_hook',             this.method_hook(tree, match._object, match._method,                         match._parameters) -given[tree, match])}),

//   Entry point.
//   This is where we the trace function starts. We assume statement context, which is required for eval-style functionality to work correctly.

    this.initial_state('S'),

    where[qw(s) = s.split(/\s+/)]})})});
// Generated by SDoc 
