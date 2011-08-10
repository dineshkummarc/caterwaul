// Sequence comprehensions | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// Caterwaul pre-1.0 had a module called 'seq' that provided a finite and an infinite sequence class and localized operator overloading to make them easier to use. Using wrapper classes was both
// unnecessary (since most sequence operations were done inside the seq[] macro anyway) and problematic, as it required the user to remember to cast sequences back into arrays and such. It also
// reduced runtime performance and created a lot of unnecessary copying.

// Caterwaul 1.0 streamlines the seq[] macro by removing the sequence classes and operating directly on arrays or array-like things. Not everything in Javascript is an array, but I'm going to
// pretend that everything is (or at least looks like one) and rely on the [i] and .length properties. This allows the sequence library to (1) have a very thin design, and (2) compile down to
// tight loops without function calls.

// Notation.
// The notation is mostly a superset of the pre-1.0 sequence notation. Operators that have the same functionality as before (others are reserved for future meanings, but probably won't do what
// they used to):

// | *  = map                      e.g.  [1, 2, 3] *[x + 1] |seq            ->  [2, 3, 4]
//   *! = each                     e.g.  [1, 2, 3] *![console.log(x)] |seq  ->  [1, 2, 3]  (and logs 1, 2, 3)
//   /  = foldl                    e.g.  [1, 2, 3] /[x - next] |seq         ->  -4
//   /! = foldr                    e.g.  [1, 2, 3] /![x - next] |seq        ->  2
//   %  = filter                   e.g.  [1, 2, 3] %[x & 1] |seq            ->  [1, 3]
//   %! = filter-not               e.g.  [1, 2, 3] %![x & 1] |seq           ->  [2]
//   +  = concatenate              e.g.  [1, 2, 3] + [4, 5] |seq            ->  [1, 2, 3, 4, 5]
//   -  = cartesian product        e.g.  [1, 2] - [3, 4] |seq               ->  [[1, 3], [1, 4], [2, 3], [2, 4]]
//   ^  = zip                      e.g.  [1, 2, 3] ^ [4, 5, 6] |seq         ->  [[1, 4], [2, 5], [3, 6]]
//   |  = exists                   e.g.  [1, 2, 3] |[x === 2] |seq          ->  true

// Note that ^ has higher precedence than |, so we can use it in a sequence comprehension without interfering with the |seq macro (so long as the |seq macro is placed on the right).

//   Modifiers.
//   Modifiers are unary operators that come after the primary operator. These have the same (or similar) functionality as before:

//   | ~ = interpret something in sequence context   e.g.  [[1], [2], [3]] *~[x *[x + 1]] |seq  ->  [[2], [3], [4]]
//     x = rename the variable from 'x'              e.g.  [1, 2, 3] *y[y + 1] |seq             ->  [2, 3, 4]

//   Here, 'x' means any identifier. Caterwaul 1.0 introduces some new stuff. The map function now has a new variant, *~!. Filter also supports this variant. Like other operators, they support
//   variable renaming and sequence context. You can do this by putting those modifiers after the *~!; for instance, xs *~!~[exp] interprets 'exp' in sequence context. Similarly, *~!y[exp] uses
//   'y' rather than 'x'.

//   | *~! = flatmap         e.g. [1, 2, 3] *~![[x, x + 1]] |seq      ->  [1, 2, 2, 3, 3, 4]
//     %~! = map/filter      e.g. [1, 2, 3] %~![x & 1 && x + 1] |seq  ->  [2, 4]
//     /~! = unfold          e.g. 1 /~![x < 5 ? x + 1 : null] |seq    ->  [1, 2, 3, 4, 5]

//   Variables.
//   All of the variables from before are still available and the naming is still mostly the same. Each block has access to 'x', which is the immediate element. 'xi' is the index, and 'x0' is the
//   alternative element for folds. Because all sequences are finite, a new variable 'xl' is available -- this is the total number of elements in the source sequence. The sequence object is no
//   longer accessible because there may not be a concrete sequence. (I'm leaving room for cross-operation optimizations in the future.) The renaming is done exactly as before:

//   | [1, 2, 3] *[x + 1] |seq             -> [2, 3, 4]
//     [1, 2, 3] *y[y + 1] |seq            -> [2, 3, 4]
//     [1, 2, 3] *[xi] |seq                -> [0, 1, 2]
//     [1, 2, 3] *foo[fooi] |seq           -> [0, 1, 2]

//   Word operators.
//   Some operators are designed to work with objects, just like in prior versions. However, the precedence has been changed to improve ergonomics. For example, it's uncommon to use objects as an
//   intermediate form because all of the sequence operators are built around arrays. Similarly, it's very common to unpack objects immediately before using them. Therefore the unpack operators
//   should be very high precedence and the pack operator should have very low precedence:

//   | {foo: 'bar'} /keys |seq             -> ['foo']
//     {foo: 'bar'} /values |seq           -> ['bar']
//     {foo: 'bar'} /pairs |seq            -> [['foo', 'bar']]
//     {foo: 'bar'} /pairs |object |seq    -> {foo: 'bar'}

//   Note that unlike regular modifiers you can't use a variety of operators with each word. Each one is defined for just one form. I may change this in the future, but I'm reluctant to start
//   with it because it would remove a lot of syntactic flexibility.

//   Update: After using this in the field, I've found that the low-precedence |object form is kind of a pill. Now the sequence library supports several variants, /object, -object, and |object.

//   Prefixes.
//   New in Caterwaul 1.0.3 is the ability to specify the scope of operation for sequence macros. For instance, you might want to operate on one of several types of data. Normally the sequence
//   macro assumes arrays, but you may want to modify a unary operator such as *[] to transform an object's keys or values. Prefixes let you do this.

//   | o %k*[x.substr(1)] -seq     (equivalent to  o /pairs *[[x[0].substr(1), x[1]]]  -object -seq)
//     o %v*[x.split(/a/)] -seq    (equivalent to  o /pairs *[[x[0], x[1].split(/a/)]] -object -seq)

//   Prefixes are generally faster than manual unpacking and repacking. However, some operations (e.g. fold and its variants) don't work with prefixes. The reason is that it's unclear what to do
//   with the values that correspond to a folded key, for instance. (Imagine what this would mean: o %k/[x + x0] -seq) The following operators can be used with prefixes:

//   | *   = map
//     *!  = each          <- returns the original object
//     %   = filter        <- removes key/value pairs
//     %!  = filter-not
//     %~! = map-filter    <- changes some key-value pairs, removes others

//   These operators support the standard set of modifiers, including ~ prefixing and variable renaming. However, indexing variables such as xi and xl are unavailable because no temporary arrays
//   are constructed.

//   The following operators cannot be used with prefixes because it's difficult to imagine what purpose they would serve:

//   | *~! = flatmap
//     /   = foldl
//     /!  = foldr
//     /~! = unfold

//   None of the binary operators (e.g. +, -, ^, etc) can be used with prefixes because of precedence. Any prefix would bind more strongly to the left operand than it would to the binary
//   operator, which would disrupt the syntax tree.

//   Folding prefixes.
//   New in Caterwaul 1.0.4 is the ability to specify fold prefixes. This allows you to specify the initial element of a fold:

//   | xs /[0][x0 + x*x] -seq              (sum the squares of each element)
//     xs /~[[]][x0 + [x, x + 1]] -seq     (equivalent to  xs *~![[x, x + 1]] -seq)

//   Function promotion.
//   Caterwaul 1.0.4 adds support for implicit function promotion of sequence block expressions:

//   | f(x) = x + 1
//     seq in [1, 2, 3] *f
//     seq in [-1, 0, 1] %f

//   You can use this to make method calls, which will remain bound to the original object even though the object expression is evaluated only once:

//   | xs *foo.bar -seq            (equivalent to  xs *[foo.bar(x)] -seq)
//     xs *(bar + bif).baz -seq    (equivalent to  xs *[temp.baz(x)] -seq -where [temp = bar + bif])

//   The only restriction is that you can't use a bracketed expression as the last operator; otherwise it will be interpreted as a block. You also can't invoke a promoted function in sequence
//   context, since it is unclear what the intent would be.

//   Numbers.
//   Caterwaul 1.0 removes support for the infinite stream of naturals (fun though it was), since all sequences are now assumed to be finite and are strictly evaluated. So the only macro
//   available is n[], which generates finite sequences of evenly-spaced numbers:

//   | n[1, 10] |seq               ->  [1, 2, 3, 4, 5, 6, 7, 8, 9]
//     n[10] |seq                  ->  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//     n[0, 10, 2] |seq            ->  [0, 2, 4, 6, 8]

// Generated code.
// Previously the code was factored into separate methods that took callback functions. (Basically the traditional map/filter/each arrangement in functional languages.) However, now the library
// optimizes the methods out of the picture. This means that now we manage all of the dataflow between the different sequence operators. I thought about allocating gensym variables -- one for
// each temporary result -- but this means that the temporary results won't be garbage-collected until the entire sequence comprehension is complete. So instead it generates really gnarly code,
// with each dependent sequence listed in the for-loop variable initialization.

// Luckily this won't matter because, like, there aren't any bugs or anything ;)

// Portability.
// The seq library is theoretically portable to syntaxes besides JS, but you'll probably want to do some aggressive preprocessing if you do this. It assumes a lot about operator precedence and
// such (from a design perspective).

caterwaul.js_base()(function ($) {
  $.seq_macro(language) = language.modifier('seq', this.expand(seq_expand(tree._expression)) -given.tree -where [seq_expand = $.seq()]);

  $.seq() = $.clone().macros(operator_macros, word_macros)
            -effect [it.init_function(tree) = this.macroexpand(anon('S[_x]').replace({_x: tree}))]

  -where [anon            = $.anonymizer('S'),
          rule(p, e)      = $.macro(anon(p), e.constructor === Function ? given.match in this.expand(e.call(this, match)) : anon(e)),

          operator_macros = [rule('S[_x]', '_x'),
                             rule('S[_x, _y]', 'S[_x], S[_y]'),                     operator('', '|', exists),
                             rule('S[(_x)]', '(S[_x])'),

                             operator('', '*', map,    each,       flatmap),        binary_operator('+', concat),
                             operator('', '%', filter, filter_not, map_filter),     binary_operator('-', cross),
                             operator('', '/', foldl,  foldr,      unfold),         binary_operator('^', zip),

                             operator('k', '*', kmap,    keach),                    operator('v', '*', vmap,    veach),
                             operator('k', '%', kfilter, kfilter_not, kmap_filter), operator('v', '%', vfilter, vfilter_not, vmap_filter)]

                     -where [operator(prefix, op, normal, bang, tbang) = [] -effect- it.push(trule(op, 'S[_xs #{p}*[_f]]',   normal), trule(op, 'S[_xs #{p}*_var[_f]]',   normal))
                                                                            -effect- it.push(trule(op, 'S[_xs #{p}*![_f]]',  bang),   trule(op, 'S[_xs #{p}*!_var[_f]]',  bang))   /when.bang
                                                                            -effect- it.push(trule(op, 'S[_xs #{p}*~![_f]]', tbang),  trule(op, 'S[_xs #{p}*~!_var[_f]]', tbang))  /when.tbang
                                                                         -returning- it.concat(context_conversions(p, op))

                                                                         -where [p = prefix && '%#{prefix}'],

                             binary_operator(op, f)                    = rule(t('S[_xs + _ys]'), f) -where [t(pattern) = anon(pattern).replace({'+': op})]]

                     -where [template(op, p)            = anon(p).replace({'*': op}),
                             trule(op, p, e)            = rule(template(op, p), e.constructor === Function ? e : template(op, e)),

                             context_conversions(p, op) = [trule(op, 'S[_xs #{p}*~[_f]]',   'S[_xs #{p}*[S[_f]]]'),   trule(op, 'S[_xs #{p}*~_var[_f]]',   'S[_xs #{p}*_var[S[_f]]]'),
                                                           trule(op, 'S[_xs #{p}*!~[_f]]',  'S[_xs #{p}*![S[_f]]]'),  trule(op, 'S[_xs #{p}*!~_var[_f]]',  'S[_xs #{p}*!_var[S[_f]]]'),
                                                           trule(op, 'S[_xs #{p}*~!~[_f]]', 'S[_xs #{p}*~![S[_f]]]'), trule(op, 'S[_xs #{p}*~!~_var[_f]]', 'S[_xs #{p}*~!_var[S[_f]]]')],

                             loop_anon                  = $.anonymizer('xs', 'ys', 'x', 'y', 'i', 'j', 'l', 'lj', 'r', 'o', 'k'),
                             loop_form(x)               = loop_anon(scoped(anon(x))),

                             scope                      = anon('(function (xs) {_body}).call(this, S[_xs])'),
                             scoped(tree)               = scope.replace({_body: tree}),

                             op_form(pattern)           = bind [form = loop_form(pattern)] in form.replace(variables_for(match)) -given.match,

                             map         = op_form('for (var ys = [], _xi = 0, _xl = xs.length, _x; _xi < _xl; ++_xi) _x = xs[_xi], ys.push((_f));                                 return ys'),
                             each        = op_form('for (var          _xi = 0, _xl = xs.length, _x; _xi < _xl; ++_xi) _x = xs[_xi], (_f);                                          return xs'),
                             flatmap     = op_form('for (var ys = [], _xi = 0, _xl = xs.length, _x; _xi < _xl; ++_xi) _x = xs[_xi], ys.push.apply(ys, ys.slice.call((_f)));        return ys'),

                             filter      = op_form('for (var ys = [], _xi = 0, _xl = xs.length, _x; _xi < _xl; ++_xi) _x = xs[_xi], (_f) && ys.push(_x);                           return ys'),
                             filter_not  = op_form('for (var ys = [], _xi = 0, _xl = xs.length, _x; _xi < _xl; ++_xi) _x = xs[_xi], (_f) || ys.push(_x);                           return ys'),
                             map_filter  = op_form('for (var ys = [], _xi = 0, _xl = xs.length, _x, _y; _xi < _xl; ++_xi) _x = xs[_xi], (_y = (_f)) && ys.push(_y);                return ys'),

                             foldl       = op_form('for (var _x = xs[0], _xi = 1, _xl = xs.length, _x0;            _xi < _xl; ++_xi) _x0 = xs[_xi], _x = (_f);                     return _x'),
                             foldr       = op_form('for (var _xl = xs.length - 1, _xi = _xl - 1, _x0 = xs[_xl], _x; _xi >= 0; --_xi) _x = xs[_xi], _x0 = (_f);                     return _x0'),
                             unfold      = op_form('for (var ys = [], _x = xs, _xi = 0;                          _x !== null; ++_xi) ys.push(_x), _x = (_f);                       return ys'),

                             exists      = op_form('for (var _x = xs[0], _xi = 0, _xl = xs.length, x; _xi < _xl; ++_xi) {_x = xs[_xi]; if (y = (_f)) return y} return false'),

                             concat      = op_form('return xs.concat(S[_ys])'),
                             zip         = op_form('for (var ys = S[_ys], pairs = [], i = 0, l = xs.length; i < l; ++i) pairs.push([xs[i], ys[i]]); return pairs'),
                             cross       = op_form('for (var ys = S[_ys], pairs = [], i = 0, l = xs.length, lj = ys.length; i < l; ++i) ' +
                                                     'for (var j = 0; j < lj; ++j) pairs.push([xs[i], ys[j]]);' + 'return pairs'),

                             kmap        = op_form('var r = {};        for (var _x in xs) if (Object.prototype.hasOwnProperty.call(xs, _x)) r[_f] = xs[_x];                        return r'),
                             keach       = op_form('                   for (var _x in xs) if (Object.prototype.hasOwnProperty.call(xs, _x)) _f;                                    return xs'),

                             kfilter     = op_form('var r = {};        for (var _x in xs) if (Object.prototype.hasOwnProperty.call(xs, _x) &&      (_f))  r[_x] = xs[_x];          return r'),
                             kfilter_not = op_form('var r = {};        for (var _x in xs) if (Object.prototype.hasOwnProperty.call(xs, _x) &&    ! (_f))  r[_x] = xs[_x];          return r'),
                             kmap_filter = op_form('var r = {}, x;     for (var _x in xs) if (Object.prototype.hasOwnProperty.call(xs, _x) && (x = (_f))) r[x]  = xs[_x];          return r'),

                             vmap        = op_form('var r = {}, _x;    for (var  k in xs) if (Object.prototype.hasOwnProperty.call(xs, k)) _x = xs[k], r[k] = (_f);                return r'),
                             veach       = op_form('var _x;            for (var  k in xs) if (Object.prototype.hasOwnProperty.call(xs, k)) _x = xs[k], _f;                         return xs'),

                             vfilter     = op_form('var r = {}, _x;    for (var  k in xs) if (Object.prototype.hasOwnProperty.call(xs, k)) _x = xs[k],        (_f) && (r[k] = _x); return r'),
                             vfilter_not = op_form('var r = {}, _x;    for (var  k in xs) if (Object.prototype.hasOwnProperty.call(xs, k)) _x = xs[k],        (_f) || (r[k] = _x); return r'),
                             vmap_filter = op_form('var r = {}, _x, x; for (var  k in xs) if (Object.prototype.hasOwnProperty.call(xs, k)) _x = xs[k], x = (_f), x && (r[k] =  x); return r'),

                             variables_for(m) = $.merge({}, m, prefixed_hash(m._var)),
                             prefixed_hash(p) = {_x: name, _xi: '#{name}i', _xl: '#{name}l', _x0: '#{name}0'} -where[name = p && p.data || 'x']],

          word_macros     = [rule('S[n[_upper]]',                n),  rule('S[_o /keys]',   keys),    rule('S[_o |object]', object),
                             rule('S[n[_lower, _upper]]',        n),  rule('S[_o /values]', values),  rule('S[_o -object]', object),
                             rule('S[n[_lower, _upper, _step]]', n),  rule('S[_o /pairs]',  pairs),   rule('S[_o /object]', object)]

                     -where [n(match)  = n_pattern.replace($.merge({_lower: '0', _step: '1'}, match)),
                             n_pattern = anon('(function (i, u, s) {if ((u - i) * s <= 0) return [];' +                // Check for degenerate iteration
                                                                   'for (var r = [], d = u - i; d > 0 ? i < u : i > u; i += s) r.push(i); return r})((_lower), (_upper), (_step))'),

                             scope     = anon('(function (o) {_body}).call(this, (S[_o]))'),
                             scoped(t) = scope.replace({_body: t}),

                             form(p)   = tree.replace(match) -given.match -where [tree = scoped(anon(p))],
                             keys      = form('var ks = []; for (var k in o) Object.prototype.hasOwnProperty.call(o, k) && ks.push(k); return ks'),
                             values    = form('var vs = []; for (var k in o) Object.prototype.hasOwnProperty.call(o, k) && vs.push(o[k]); return vs'),
                             pairs     = form('var ps = []; for (var k in o) Object.prototype.hasOwnProperty.call(o, k) && ps.push([k, o[k]]); return ps'),

                             object    = form('for (var r = {}, i = 0, l = o.length, x; i < l; ++i) x = o[i], r[x[0]] = x[1]; return r')]]})(caterwaul);

// Generated by SDoc 
