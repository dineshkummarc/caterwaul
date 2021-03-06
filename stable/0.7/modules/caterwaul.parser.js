// Caterwaul parser module | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// The caterwaul parser uses a combinatory approach, much like Haskell's parser combinator library. The parser consumes elements from a finite input stream and emits the parse tree at each step.
// Note that parsers generated here are not at all insightful or necessarily performant. In particular, left-recursion isn't resolved, meaning that the parser will loop forever in this case.

//   Basis and acknowledgements.
//   This parser library is based heavily on Chris Double's JSParse (available at github.com/doublec/jsparse), which implements a memoized combinatory PEG parser. If you are looking for a simple
//   and well-designed parsing library, I highly recommend JSParse; it will be easier to use and more predictable than caterwaul.parser. Like JSParse, these parsers are memoized and use parsing
//   expression grammars. However, this parser is probably quite a lot slower.

// Internals.
// Memoization is restricted to a session rather than being global. This prevents the space leak that would otherwise occur if the parser outlived the result. Behind the scenes the parser
// promotes the input into a parse-state (very much like the ps() function in JSParse). Like other caterwaul libraries, this one uses non-macro constructs behind the scenes. You can easily get at
// this by accessing stuff inside the caterwaul.parser namespace.

  caterwaul.tconfiguration('std seq continuation memoize', 'parser.core', function () {
    this.namespace('parser') /se[_.parse_state(input, i, result, memo) = undefined /se[this.input = input, this.i = i, this.result = result, this.memo = memo],
                                 _.parse_state /se.s[s.from_input(input) = new _.parse_state(input, 0, null, {}),
                                                     s.prototype /se[_.accept(i, r) = new this.constructor(this.input, i, r, this.memo),
                                                                     _.has_input()  = this.i < this.input.length,
                                                                     _.toString()   = 'ps[#{this.input.substr(this.i)}, #{this.result}]']],

                                 _.memoize               = caterwaul.memoize.from(fn[c, as, f][k in m ? m[k] : (m[k] = f.apply(c, as)),
                                                                                               where[k = '#{f.original.memo_id}|#{as[0].i}', m = as[0].memo || (as[0].memo = {})]]),
                                 _.promote_non_states(f) = fn[state][state instanceof _.parse_state ? f.call(this, state) : f.call(this, _.parse_state.from_input(state)) /re[_ && _.result]],
                                 _.identify(f)           = f /se[_.memo_id = caterwaul.gensym()],
                                 _.parser(f)             = _.promote_non_states(_.memoize(_.identify(f))),
                                 _.defparser(name, f)    = _.parsers[name]() = _.parser(f.apply(this, arguments)),
                                 _.parsers               = {}]}).

// Notation.
// Parsers are written as collections of named nonterminals. Each nonterminal contains a mandatory expansion and an optional binding:

// | peg[c('a') % c('b')]                                 // A grammar that recognizes the character 'a' followed by the character 'b'
//   peg[c('a') % c('b') >> fn[ab][ab[0] + ab[1]]]        // The same grammar, but the AST transformation step appends the two characters

// The >> notation is borrowed from Haskell (would have been >>=, but this requires a genuine lvalue on the left); the idea is that the optional binding is a monadic transform on the parse-state
// monad. (The only difference is that you don't have to re-wrap the result in a new parse state using 'return' as you would in Haskell -- the return here is implied.) The right-hand side of >>
// can be any expression that returns a function. It will be evaluated directly within its lexical context, so the peg[] macro is scope-transparent modulo gensyms and the namespace importing of
// caterwaul.parser.parsers.

// Parsers are transparent over parentheses. Only the operators described below are converted specially.

//   Constants.
//   Strings are parsable by using the c(x) function, which is named this because it matches a constant.

//   | peg[c('x')]                 // Parses the string 'x'
//     peg[c('foo bar')]           // Parses the string 'foo bar'
//     peg[c(['foo', 'bar'])]      // Parses either the string 'foo' or the string 'bar', in mostly-constant time in the size of the array (see below)
//     peg[c({foo: 1, bar: 2})]    // Parses either the string 'foo' or the string 'bar'; returns 1 if 'foo' matched, 2 if 'bar' matched (also in mostly-constant time)
//     peg[c(/\d+/, 1)]            // Parses strings of digits with a minimum length of 1. The parse is greedy, and the regexp's exec() method output is returned.
//     peg[c(fn[s][3])]            // Always takes three characters, regardless of what they are.

//   The c() function can take other arguments as well. One is an array of strings; in this case, it matches against any string in the array. (Matching time is O(l), where l is the number of
//   distinct lengths of strings.) Another is an object; if any directly-contained (!) attribute of the key is parsed and consumed, then the value associated with that key is returned. The time
//   for this algorithm is O(l), where l is the number of distinct lengths of the keys in the object.

//   Another option is specifying a regular expression with a minimum length. The rule is that the parser fails immediately if the regexp doesn't match the minimum length of characters. If it
//   does match, then the maximum matching length is found. This ends up performing O(log n) regexp-matches against the input, for a total runtime of O(n log n). (The algorithm here is an
//   interesting one: Repeatedly double the match length until matching fails, then binary split between the last success and the first failure.) Because of the relatively low performance of this
//   regexp approach, it may be faster to use a regular finite-automaton for routine parsing and lexing. Then again, O(log n) linear-time native code calls may be faster than O(n) constant-time
//   calls in practice.

//   In order for a regular expression to work sensibly in this context, it needs to have a couple of properties. One is that it partitions two contiguous ranges of substrings into matching and
//   non-matching groups, and that the matching group, if it exists, contains shorter substrings than the non-matching group. Put differently, there exists some k such that substrings from length
//   minimum (the minimum that you specify as the second argument to c()) to k all match, and substrings longer than k characters all fail to match. The other property is that the initial match
//   length must be enough to accept or reject the regular expression. So, for example, c(/[a-zA-Z0-9]+/, 1) is a poor way to match against identifiers since it will also quite happily take an
//   integer.

//   Note that if you specify a regular expression, the parser library will recompile it into a new one that is anchored at both ends. This is necessary for sane behavior; nobody would ever want
//   anything else. This means that matching on /foo/ will internally generate /^foo$/. This recompilation process preserves the flags on the original however. (Though you seriously shouldn't use
//   /g -- I have no idea what this would do.)

//   Finally, you can also specify a function. If you do this, the function will be invoked on the input and the current offset, and should return the number of characters it intends to consume.
//   It returns a falsy value to indicate failure.

    tconfiguration('std seq continuation', 'parser.c', function () {
      this.configure('parser.core').parser.defparser('c', fn[x, l][
        x.constructor === String   ? fn[st][st.accept(st.i + x.length, x), when[x === st.input.substr(st.i, x.length)]] :
        x instanceof Array         ? l[index = index_entries(x)] in fn[st][check_index(index, st.input, st.i) /re[_ && st.accept(st.i + _.length, _)]] :
        x.constructor === RegExp   ? l[x = add_absolute_anchors_to(x)] in
                                     fn[st][fail_length(x, st.input, st.i, l) /re[_ > l && split_lengths(x, st.input, st.i, l, _) /re[st.accept(st.i + _, x.exec(st.input.substr(st.i, _)))]]] :
        x.constructor === Function ? fn[st][x.call(st, st.input, st.i) /re[_ && st.accept(st.i + _, st.input.substr(st.i, _))]] :
                                     l[index = index_entries(seq[sk[x]])] in fn[st][check_index(index, st.input, st.i) /re[_ && st.accept(st.i + _.length, x[_])]],

        where*[check_index(i, s, p) = seq[i |[_['@#{s}'] && s, where[s = s.substr(p, _.length)]]],
               index_entries(xs)    = l*[xsp = seq[~xs], ls = seq[sk[seq[!(xsp *[[_.length, true]])]] *[Number(_)]]] in
                                      seq[~ls.slice().sort(fn[x, y][y - x]) *~l[!(xsp %[_.length === l] *[['@#{_}', true]] + [['length', l]])]],

               add_absolute_anchors_to(x)    = l[parts = /^\/(.*)\/(\w*)$/.exec(x.toString())] in new RegExp('^#{parts[1]}$', parts[2]),
               fail_length(re, s, p, l)      = re.test(s.substr(p, l)) ? p + (l << 1) <= s.length ? fail_length(re, s, p, l << 1) : l << 1 : l,
               split_lengths(re, s, p, l, u) = l*[b(l, u) = l + 1 < u ? (l + (u - l >> 1)) /re.m[re.test(s.substr(p, m)) ? b(m, u) : b(l, m)] : l] in b(l, u)]])}).

//   Sequences.
//   Denoted using the '%' operator. The resulting AST is flattened into a finite caterwaul sequence. For example:

//   | peg[c('a') % c('b') % c('c')]('abc')                     // -> ['a', 'b', 'c']
//     peg[c('a') % c('b') >> fn[xs][xs.join('/')]]('ab')       // -> 'a/b'

    tconfiguration('std opt seq continuation', 'parser.seq', function () {
      this.configure('parser.core').parser.defparser('seq', fn_[l[as = arguments] in fn[state][
        call/cc[fn[cc][opt.unroll[i, as.length][(state = as[i](state)) ? result.push(state.result) : cc(false)], state.accept(state.i, result)]], where[result = []]]])}).

//   Alternatives.
//   Denoted using the '/' operator. Alternation is transparent; that is, the chosen entry is returned identically. Entries are tried from left to right without backtracking. For example:

//   | peg[c('a') / c('b')]('a')        // -> 'a'

    tconfiguration('std opt seq continuation', 'parser.alt', function () {
      this.configure('parser.core').parser.defparser('alt', fn_[l[as = seq[~arguments]] in fn[state][seq[as |[_(state)]]]])}).

//   Repetition.
//   Denoted using subscripted ranges, similar to the notation used in regular expressions. For example:

//   | peg[c('a')[0]]                   // Zero or more 'a's
//     peg[c('b')[1,4]                  // Between 1 and 4 'b's

    tconfiguration('std opt seq continuation', 'parser.times', function () {
      this.configure('parser.core').parser.defparser('times', fn[p, lower, upper][fn[state][
        call/cc[fn[cc][opt.unroll[i, lower][++count, (state = p(state)) ? result.push(state.result) : cc(false)], true]] &&
        call/cc[l*[loop(cc) = (! upper || count++ < upper) && state.has_input() && p(state) /se[state = _, when[_]] ?
                              result.push(state.result) && call/tail[loop(cc)] : cc(state.accept(state.i, result))] in loop], where[count = 0, result = []]]])}).

//   Optional things.
//   Denoted using arrays. Returns a tree of undefined if the option fails to match. For example:

//   | peg[c('a') % [c('b')] % c('c')]  // a followed by optional b followed by c

    tconfiguration('std opt seq continuation', 'parser.opt', function () {
      this.configure('parser.core').parser.defparser('opt', fn[p][fn[state][state.accept(n, r), where*[s = p(state), n = s ? s.i : state.i, r = s && s.result]]])}).

//   Positive and negative matches.
//   Denoted using unary + and -, respectively. These consume no input but make assertions:

//   | peg[c('a') % +c('b')]            // Matches an 'a' followed by a 'b', but consumes only the 'a'
//     peg[c('a') % -c('b')]            // Matches an 'a' followed by anything except 'b', but consumes only the 'a'

    tconfiguration('std opt seq continuation', 'parser.match', function () {
      this.configure('parser.core').parser /se[_.defparser('match',  fn[p][fn[state][p(state) /re[_  && state.accept(state.i, state.result)]]]),
                                               _.defparser('reject', fn[p][fn[state][p(state) /re[!_ && state.accept(state.i, null)]]])]}).

//   Binding.
//   This is fairly straightforward; a parser is 'bound' to a function by mapping through the function if it is successful. The function then returns a new result based on the old one. Binding is
//   denoted by the >> operator.

    tconfiguration('std opt seq continuation', 'parser.bind', function () {
      this.configure('parser.core').parser /se[_.defparser('bind', fn[p, f][fn[state][p(state) /re[_ && _.accept(_.i, f.call(_, _.result))]]])]}).

// DSL macro.
// Most of the time you'll want to use the peg[] macro rather than hand-coding the grammar. The macro both translates the tree and introduces all of the parsers as local variables (like a with()
// block, but much faster and doesn't earn the wrath of Douglas Crockford).

  tconfiguration('std opt seq continuation', 'parser.dsl', function () {
    this.configure('parser.core').rmacro(qs[peg[_]],
      fn[x][qs[qg[l*[_bindings][_parser]]].replace({_bindings: new this.syntax(',', seq[sp[this.parser.parsers] *[qs[_x = _y].replace({_x: _[0], _y: new outer.ref(_[1])})]]),
                                                      _parser: this.parser.dsl.macroexpand(x)}), where[outer = this]]),

    this.parser.dsl = caterwaul.global().clone() /se.dsl[dsl.macro /se[
      _(qs[_(_)], fn[x, y][qs[_x(_y)].replace({_x: e(x), _y: y})]),
      _(qs[_ / _], fb('/', 'alt')), _(qs[_ % _], fb('%', 'seq')), _(qs[_ >> _], b('bind')), _(qs[[_]], u('opt')), _(qs[_].as('('), fn[x][e(x).as('(')]),
      _(qs[_[_]], fn[x, l][qs[times(_x, _l)].replace({_x: e(x), _l: l})]), _(qs[_[_, _]], fn[x, l, u][qs[times(_x, _l, _u)].replace({_x: e(x), _l: l, _u: u})]),
      where*[e = dsl.macroexpand, fb(op, name)(x, y) = qs[_name(_x, _y)].replace({_name: name, _x: x.flatten(op).map(e) /se[_.data = ','], _y: e(y)}),
                                       b(name)(x, y) = qs[_name(_x, _y)].replace({_name: name, _x: e(x), _y: y}),
                                          u(name)(x) = qs[_name(_x)]    .replace({_name: name, _x: e(x)})]]]}).

// Final configuration.
// Loads both the classes and the peg[] macro.

  configuration('parser', function () {
    this.configure('parser.core parser.c parser.seq parser.alt parser.times parser.opt parser.match parser.bind parser.dsl')});
// Generated by SDoc 
