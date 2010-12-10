// Caterwaul JS sequence library | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// Javascript's looping facilities are side-effectful and more importantly operate in statement-mode rather than expression-mode. This sequence library moves finite and anamorphic looping into
// expression-mode using both methods and macros. Macros are used sparingly here; they provide comprehensions, but are ultimately just shorthands for sequence methods. All sequences ultimately
// inherit from Array, which may or may not work as desired.

  caterwaul.tconfiguration('std', 'seq.core', function () {this.shallow('seq', {core: fn_[null] /se[_.prototype = [] /se.p[p.constructor = _]]})}).

// There are two kinds of sequences represented here. One is a finite sequence, which is eager and acts like a Javascript array (though it has a different prototype). The other is an infinite
// stream; this is an anamorphism that generates new elements from previous ones. Because Javascript isn't required to optimize tail calls, any recursion done by the sequence library is coded in
// CPS using the continuation library.

// Finite sequence API.
// Finite sequences are assumed to have numbered elements and a 'length' field, just like a Javascript array or jQuery object. Any mapping, filtering, or folding on these sequences is done
// eagerly (put differently, most sequence/stream operations are closed under eagerness). There's a core prototype for finite sequences that contains eager implementations of each(), map(),
// filter(), foldl(), foldr(), zip(), etc.

  tconfiguration('std', 'seq.finite.core', function () {
    let[push = Array.prototype.push, slice = Array.prototype.slice]
    [this.configure('seq.core').seq.finite = fc[xs][this.length = 0, push.apply(this, slice.call(xs || []))] /se.c[c.prototype = new this.seq.core() /se[
      _.size() = this.length, _.constructor = c]]]}).

  tconfiguration('std', 'seq.finite.serialization', function () {
    this.configure('seq.finite.core').seq.finite.prototype.toString() = 'seq[#{Array.prototype.slice.call(this).join(", ")}]'}).

//   Mutability.
//   Sequences can be modified in-place. Depending on how Javascript optimizes this case it may be much faster than reallocating. Note that the methods here are not quite the same as the regular
//   Javascript array methods. In particular, push() returns the sequence rather than its new length. Also, there is no shift()/unshift() API. These would each be linear-time given that we're
//   using hard indexes. concat() behaves as it does for arrays; it allocates a new sequence rather than modifying either of its arguments.

    tconfiguration('std', 'seq.finite.mutability', function () {
      let[push = Array.prototype.push, slice = Array.prototype.slice] in
      this.configure('seq.finite.core').seq.finite.prototype /se[_.push()     = (push.apply(this, arguments), this),            // Can't /se this one; it references 'arguments'
                                                                 _.pop()      = this[--this.length] /se[(function () {delete this[this.length]}).call(this)],
                                                                 _.concat(xs) = new this.constructor(this) /se[_.push.apply(_, slice.call(xs))]]}).

//   Object interfacing.
//   Sequences can be built from object keys, values, or key-value pairs. This keeps you from having to write for (var k in o) ever again. Also, you can specify whether you want all properties or
//   just those which belong to the object directly (by default the latter is assumed). For example:

//   | var keys     = caterwaul.seq.finite.keys({foo: 'bar'});             // hasOwnProperty is used
//     var all_keys = caterwaul.seq.finite.keys({foo: 'bar'}, true);       // hasOwnProperty isn't used; you get every enumerable property

//   Javascript, unlike Perl, fails to make the very useful parallel between objects and arrays. Because references are cheap in Javascript (both notationally and computationally), the
//   representation of an object is slightly different from the one in Perl. You use an array of pairs, like this: [[k1, v1], [k2, v2], ..., [kn, vn]].

//   | object([o = {}]): Zips a sequence of pairs into an object containing those mappings. Later pairs take precedence over earlier ones if there is a collision. You can specify an optional
//                       object o to zip into; if you do this, then the pairs are added to o and o is returned instead of creating a new object and adding pairs to that.

    tconfiguration('std', 'seq.finite.object', function () {
      let[own = Object.prototype.hasOwnProperty] in
      this.configure('seq.finite.core').seq.finite /se[_.keys  (o, all) = new _() /se[(function () {for (var k in o) if (all || own.call(o, k)) _.push(k)})()],
                                                       _.values(o, all) = new _() /se[(function () {for (var k in o) if (all || own.call(o, k)) _.push(o[k])})()],
                                                       _.pairs (o, all) = new _() /se[(function () {for (var k in o) if (all || own.call(o, k)) _.push([k, o[k]])})()],
                                                       _.prototype.object(o) = (o || {}) /se[this.each(fn[p][_[p[0]] = p[1]])]]}).

//   Mapping and traversal.
//   Sequences support the usual set of map/filter/fold operations. Unlike most sequence libraries, though, all of these functions used unrolled loops. This means that if your JS runtime has good
//   hot-inlining support they should be really fast. (The same does not hold for the infinite stream library, which uses simulated continuations for lots of things and is probably quite slow.)

//   If you fold on a sequence with too few elements (and you don't supply extras by giving it more arguments), it will return something falsy.

    tconfiguration('std opt', 'seq.finite.traversal', function () {
      this.configure('seq.finite.core seq.finite.mutability').seq.finite.prototype
        /se[_.map(f)      = new this.constructor() /se[opt.unroll[i, this.length][_.push(f.call(this, this[i], i))]],
            _.filter(f)   = new this.constructor() /se[opt.unroll[i, this.length][_.push(this[i]), when[f.call(this, this[i], i)]]],
            _.each(f)     = this                   /se[opt.unroll[i,    _.length][f.call(_, _[i], i)]],
            _.reversed()  = new this.constructor() /se[let[l = this.length] in opt.unroll[i, l][_.push(this[l - i - 1])]],
            _.flat_map(f) = new this.constructor() /se[this.each(fn[x, xi][(f.call(this, x, xi) /re.xs[xs.each ? xs : new this.constructor(xs)]).each(fn[x][_.push(x)])])],

            _.foldl(f, x) = let[x = arguments.length > 1 ? x : this[0], xi = 2 - arguments.length]
                               [opt.unroll[i, this.length - xi][x = f.call(this, x, this[i + xi], i + xi)], x, when[this.length >= xi]],
            _.foldr(f, x) = let[x = arguments.length > 1 ? x : this[this.length - 1], xi = 3 - arguments.length, l = this.length]
                               [opt.unroll[i, l - (xi - 1)][x = f.call(this, this[l - (i + xi)], x, l - (i + xi))], x, when[l >= xi - 1]]]}).

//   Zipping.
//   Zipping as a generalized construct has a few variants. One is the function used to zip (by default, [x, y]), another is the number of sequences to zip together, and the last one is whether
//   you want an inner or outer product. Here's the full argument syntax for zip() with defaults:

//   | xs.zip(xs1, xs2, ..., xsn, {f: fn_[new seq(arguments)], outer: false})

//   Each of xsi should be an array-ish object (i.e. should support the .length and [i] attributes). If you specify the optional hash at the end, its 'f' attribute, if specified, will be invoked
//   on every n-tuple of items, and if 'outer' is truthy then you will have the outer-product of all of your sequences (i.e. the longest sequence length is used, and undefined is specified when
//   you run past the end of any other one).

    tconfiguration('std opt', 'seq.finite.zip', function () {
      this.configure('seq.finite.traversal').seq.finite
        /se[let[seq = _, slice = Array.prototype.slice][_.prototype.zip() =
          let[as = new seq([this].concat(slice.call(arguments))), options = {f: fn_[new seq(arguments)], outer: false}]
             [caterwaul.util.merge(options, as.pop()), when[as[as.length - 1].constructor === Object],
              let[l = as.map(fn[x][x.length]).foldl(options.outer ? fn[x, y][Math.max(x, y)] : fn[x, y][Math.min(x, y)]), f = options.f] in
              new this.constructor() /se[opt.unroll[i, l][_.push(f.apply({i: i}, as.map(fn[x][x[i]]).slice()))]]]]]}).

//   Quantification.
//   Functions to determine whether all sequence elements have some property. exists() returns the element that satisfies the predicate if it's truthy; otherwise it just returns true.

    tconfiguration('std opt continuation', 'seq.finite.quantification', function () {
      this.configure('seq.finite.core').seq.finite.prototype /se[_.exists(f) = call/cc[fb[cc][opt.unroll[i, this.length][f.call(this, this[i], i) && cc(this[i] || true)], false]],
                                                                 _.forall(f) = ! this.exists(fn_[! f.apply(this, arguments)])]}).

// Stream API.
// All streams are assumed to be infinite in length; that is, given some element there is always another one. Streams provide this interface with h() and t() methods; the former returns the first
// element of the stream, and the latter returns a stream containing the rest of the elements.

  tconfiguration('std', 'seq.infinite.core', function () {
    this.configure('seq.core').seq.infinite = fn_[null] /se[_.prototype = new this.seq.core() /se[_.constructor = ctor], where[ctor = _]]
      /se[_.def(name, ctor, h, t) = i[name] = ctor /se[_.prototype = new i() /se[_.h = h, _.t = t, _.constructor = ctor]], where[i = _],

          _.def('cons', fn[h, t][this._h = h, this._t = t], fn_[this._h], fn_[this._t]),
          _.def('k',    fn   [x][this._x = x],              fn_[this._x], fn_[this])]}).

//   Anamorphisms via fixed-point.
//   Anamorphic streams are basically unwrapped version of the Y combinator. An anamorphic stream takes a function f and an initial element x, and returns f(x), f(f(x)), f(f(f(x))), ....

    tconfiguration('std', 'seq.infinite.y', function () {
      this.configure('seq.infinite.core').seq.infinite.def('y', fc[f, x][this._f = f, this._x = x], fn_[this._x], fn_[new this.constructor(this._f, this._f(this._x))])}).

//   Lazy map and filter.
//   These are implemented as separate classes that wrap instances of infinite streams. They implement the next() method to provide the desired functionality. map() and filter() are simple
//   because they provide streams as output. filter() is eager on its first element; that is, it remains one element ahead of what is requested.

    tconfiguration('std continuation', 'seq.infinite.transform', function () {
      this.configure('seq.infinite.core').seq.infinite
        /se[_.prototype.map(f) = new _.map(f, this),
            _.def('map', fc[f, xs][this._f = f, this._xs = xs], fn_[this._f(this._xs.h())], fn_[new this.constructor(this._f, this._xs.t())]),

            _.prototype.filter(f) = new _.filter(f, this),
            _.def('filter', fc[f, xs][this._f = f, this._xs = let*[next(s)(cc) = f(s.h()) ? cc(s) : call/tail[next(s.t())(cc)]] in call/cc[next(xs)]],
                            fn_[this._xs.h()], fn_[new this.constructor(this._f, this._xs.t())])]}).

//   Traversal and forcing.
//   This is where we convert from infinite streams to finite sequences. You can take or drop elements while a condition is true. take() always assumes it will return a finite sequence, whereas
//   drop() assumes it will return an infinite stream. (In other words, the number of taken or dropped elements is assumed to be finite.) Both take() and drop() are eager. drop() returns a
//   sequence starting with the element that fails the predicate, whereas take() returns a sequence for which no element fails the predicate.

    tconfiguration('std continuation', 'seq.infinite.traversal', function () {
      let[finite = this.configure('seq.finite.core seq.finite.mutability').seq.finite] in
      this.configure('seq.infinite.core').seq.infinite.prototype
        /se[_.drop(f) = let*[next(s)(cc) = f(s.h()) ? call/tail[next(s.t())(cc)] : cc(s)] in call/cc[next(this)],
            _.take(f) = let*[xs = new finite(), next(s)(cc) = let[h = s.h()][f(h) ? (xs.push(h), call/tail[next(s.t())(cc)]) : cc(xs)]] in call/cc[next(this)]]}).

// Sequence manipulation language.
// Using methods to manipulate sequences can be clunky, so the sequence library provides a macro to enable sequence-specific manipulation. You enter this mode by using seq[], and expressions
// inside the brackets are interpreted as sequence transformations. For example, here is some code translated into the seq[] macro:

// | var primes1 = let[two = naturals.drop(fn[x][x < 2])] in two.filter(fn[n][two.take(fn[x][x <= Math.sqrt(n)]).forall(fn[k][n % k])]);
//   var primes2 = let[two = seq[naturals >>[_ < 2]] in seq[two %n[two[_ <= Math.sqrt(n)] &[n % _]]];

// These operators are supported and take their normal Javascript precedence and associativity:

// | x *[_ + 2]            // x.map(fn[_, _i][_ + 2])
//   x *~[_ + xs]          // x.map(fn[_, _i][_.concat(xs)])
//   x *+(console/mb/log)  // x.map(console/mb/log)
//   x *!+f                // x.each(f)
//   x *![console.log(_)]  // x.each(fn[_, _i][console.log(_)])
//   x /[_ + _0]           // x.foldl(fn[_, _0, _i][_ + _0])
//   x /![_ + _0]          // x.foldr(fn[_, _0, _i][_ + _0])
//   x %[_ >= 100]         // x.filter(fn[_, _i][_ >= 100])
//   x %![_ >= 100]        // x.filter(fn[_, _i][!(x >= 100)])
//   x *n[n + 2]           // x.map(fn[n, ni][n + 2])
//   x *!n[console.log(n)] // x.each(fn[n, ni][console.log(n)])
//   x /n[n + n0]          // x.foldl(fn[n, n0, ni][n + n0])
//   x /!n[n + n0]         // x.foldr(fn[n, n0, ni][n + n0])
//   x %n[n % 100 === 0]   // x.filter(fn[n, ni][n % 100 === 0])
//   x %!n[n % 100]        // x.filter(fn[n, ni][!(n % 100 === 0)])
//   x <<[_ >= 10]         // x.take(fn[_][_ >= 10])
//   x <<n[n >= 10]        // x.take(fn[n][n >= 10])
//   x >>[_ >= 10]         // x.drop(fn[_][_ >= 10])
//   x >>n[n >= 10]        // x.drop(fn[n][n >= 10])
//   x |[_ === 5]          // x.exists(fn[_, _i][_ === 5])
//   x &[_ === 5]          // x.forall(fn[_, _i][_ === 5])
//   x |n[n === 5]         // x.exists(fn[n, ni][n === 5])
//   x &n[n === 5]         // x.forall(fn[n, ni][n === 5])
//   x -~[~[_, _ + 1]]     // x.flat_map(fn[_, _i][seq[~[_, _ + 1]]])
//   x -~i[~[i, i + 1]]    // x.flat_map(fn[i, ii][seq[~[i, i + 1]]])
//   x >>>[_ + 1]          // new caterwaul.seq.infinite.y(fn[_][_ + 1], x)
//   x >>>n[n + 1]         // new caterwaul.seq.infinite.y(fn[n][n + 1], x)
//   x || y                // x && x.length ? x : y
//   x && y                // x && x.length ? y : x
//   x > y                 // x.length > y.length
//   x >= y                // x.length >= y.length
//   x < y                 // x.length < y.length
//   x <= y                // x.length <= y.length
//   x == y                // x.length === y.length
//   x != y                // x.length !== y.length
//   x === y               // x.length === y.length && x.zip(y).forall(fn[p][p[0] === p[1]])
//   x !== y               // !(x === y)
//   sk[x]                 // caterwaul.seq.finite.keys(x)
//   sv[x]                 // caterwaul.seq.finite.values(x)
//   sp[x]                 // caterwaul.seq.finite.pairs(x)
//   x ^ y                 // x.zip(y)
//   x + y                 // x.concat(y)
//   !x                    // x.object()
//   ~x                    // new caterwaul.seq.finite(x)
//   +(x)                  // x    (this means 'literal')

// Method calls are treated normally and arguments are untransformed; so you can call methods normally.

//   Modifiers.
//   There are patterns in the above examples. For instance, x %[_ + 1] is the root form of the filter operator, but you can also write x %n[n + 1] to use a different variable name. The ~
//   modifier is available as well; this evaluates the expression inside brackets in sequence context rather than normal Javascript. (e.g. xs %~[_ |[_ === 1]] finds all subsequences that contain
//   1.) Finally, some operators have a ! variant (fully listed in the table above). In this case, the ! always precedes the ~.

//   Another modifier is +; this lets you use point-free form rather than creating a callback function. For example, xs %+divisible_by(3) expands into xs.filter(divisible_by(3)). This modifier
//   goes where ~ would have gone.

//   Inside the DSL code.
//   This code probably looks really intimidating, but it isn't actually that complicated. The first thing I'm doing is setting up a few methods to help with tree manipulation. The
//   prefix_substitute() method takes a prefix and a tree and looks for data items in the tree that start with underscores. It then changes their names to reflect the variable prefixes. For
//   example, prefix_substitute(qs[fn[_, _x, _i][...]], 'foo') would return fn[foo, foox, fooi].

//   Pattern definition is abstracted in case I want to change the representation later on. (I don't have any plans to do this yet.)

//   The next interesting thing is define_functional. This goes beyond define_pattern by assuming that you want to define an operator with a function body to its right; e.g. x >>[body]. It
//   defines two forms each time you call it; the first form is the no-variable case (e.g. x *[_ + 1]), and the second is the with-variable case (e.g. x *n[n + 1]). The trees_for function takes
//   care of the bang-variant of each operator. This gets triggered if you call define_functional on an operator that ends in '!'.

//   After this is the expansion logic. Any patterns that match are descended into; otherwise expansion returns its tree verbatim. Also, the expander-generator function rxy() causes expansion to
//   happen on each side. This is what keeps expansion going. When I specify a custom function it's because either (1) rxy doesn't take enough parameters, or (2) I want to specify that only some
//   subtrees should be expanded. (That's what happens when there's a dot or invocation, for instance.)

//   Pattern matching always starts at the end of the arrays. This way any new patterns that you define will bind with higher precedence than the standard ones.

//   Also, the seq[] macroexpander is deliberately eta-expanded. This allows you to replace the caterwaul.seq.dsl.expand() function to change the sequence DSL.

    tconfiguration('std opt continuation', 'seq.dsl', function () {
      this.configure('seq.core seq.infinite.y seq.finite.core seq.finite.zip seq.finite.traversal seq.finite.mutability').seq.dsl = {}

      /se[_.define_pattern(pattern, expansion)   = _ /se[ps.push([pattern, expansion])],

          _.prefix_substitute(tree, prefix)      = tree.rmap(fn[n][new n.constructor('#{prefix}#{n.data.substring(1)}'), when[n.data.charAt(0) === '_']]),
          _.define_functional(op, expansion, xs) = trees_for(op).map(fn[t, i][_.define_pattern(t,
                                                   fn[l, v, r][expansion.replace({x: _.expand(l), y: i < 4 ? qs[fn[xs][y]].replace({xs: _.prefix_substitute(xs, i & 1 ? v.data : '_'), 
                                                                                                                                     y: (i & 2 ? _.expand : fn[x][x])(r || v)}) : v})])]),

          _.define_functional /se[_('%',  qs[x.filter(y)],                      qs[_, _i]), _('*',  qs[x.map(y)],    qs[_, _i]), _('/',  qs[x.foldl(y)],    qs[_, _0, _i]),
                                  _('%!', qs[x.filter(c(y))].replace({c: not}), qs[_, _i]), _('*!', qs[x.each(y)],   qs[_, _i]), _('/!', qs[x.foldr(y)],    qs[_, _0, _i]),
                                  _('&',  qs[x.forall(y)],                      qs[_, _i]), _('|',  qs[x.exists(y)], qs[_, _i]), _('-',  qs[x.flat_map(y)], qs[_, _i]),
                                  _('>>', qs[x.drop(y)],  qs[_]), _('<<', qs[x.take(y)], qs[_]), _('>>>', qs[new r(y, x)].replace({r: new this.ref(this.seq.infinite.y)}), qs[_])],

          seq(qw('> < >= <= == !=')).each(fn[op][_.define_pattern(qs[_ + _].clone() /se[_.data = op], rxy(qs[x.length + y.length].clone() /se[_.data = op]))]),

          let[e(x) = _.expand(x)] in
          _.define_pattern /se[_(qs[_ && _], rxy(qs[qg[x && x.length ? y : x]])), _(qs[_ === _], rxy(qs[qg[x === y ||  x.length === y.length && x.zip(y).forall(fn[p][p[0] === p[1]])]])),
                               _(qs[_ || _], rxy(qs[qg[x && x.length ? x : y]])), _(qs[_ !== _], rxy(qs[qg[x !== y && (x.length !== y.length || x.zip(y).exists(fn[p][p[0] !== p[1]]))]])),

                               _(qs[_ ^ _], rxy(qs[x.zip(y)])), _(qs[_ + _], rxy(qs[x.concat(y)])), _(qs[!_], rxy(qs[x.object()])), _(qs[_, _], rxy(qs[x, y])),
                               _(qs[~_], rxy(qs[new r(x)].as('(').replace({r: new this.ref(this.seq.finite)}))), _(qs[_?_:_], fn[x, y, z][qs[x ? y : z].replace({x: e(x), y: e(y), z: e(z)})]),

                               let[rx(t)(x, y) = t.replace({x: e(x), y: y})][_(qs[_(_)], rx(qs[x(y)])), _(qs[_[_]], rx(qs[x[y]])), _(qs[_._], rx(qs[x.y])), _(qs[_].as('('), rx(qs[qg[x]]))],
                               _(qs[+_], fn[x][x]),

                               seq(qw('sk sv sp')).zip(qw('keys values pairs')).each(fb[p][_(qs[p[_]].replace({p: p[0]}), rxy(qs[r(x)].replace({r: new this.ref(this.seq.finite[p[1]])})))])],

          _.expand(t) = call/cc[fn[cc][opt.unroll[i, ps.length][let*[p = ps[ps.length - (i + 1)], m = t.match(p[0])][cc(p[1].apply(t, m)), when[m]]], t]],
          this.rmacro(qs[seq[_]], fn[x][_.expand(x)]),

          where*[template(op)(t) = qs[_ + x].replace({x: t}) /se[_.data = op], qw = caterwaul.util.qw, not = new this.ref(fn[f][fn_[!f.apply(this, arguments)]]),
                 trees_for(op) = op.charAt(op.length - 1) === '!' ? seq([qs[![_]], qs[!_[_]], qs[!~[_]], qs[!~_[_]], qs[!+_]]).map(template(op.substring(0, op.length - 1))) :
                                                                    seq([qs[[_]],  qs[_[_]],  qs[~[_]],  qs[~_[_]],  qs[+_]]). map(template(op)),
                 rxy(tree)(x, y) = tree.replace({x: _.expand(x), y: y && _.expand(y)}), seq = fb[xs][new this.seq.finite(xs)], ps = _.patterns = new this.seq.finite()]]}).

// Final configuration.
// Rather than including individual configurations above, you'll probably just want to include this one.

  configuration('seq', function () {this.configure('seq.core seq.finite.core seq.finite.object seq.finite.mutability seq.finite.traversal seq.finite.zip seq.finite.quantification ' +
                                                            'seq.finite.serialization seq.infinite.core seq.infinite.y seq.infinite.transform seq.infinite.traversal seq.dsl')});

// Generated by SDoc 
