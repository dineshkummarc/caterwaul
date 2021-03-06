// Continuation manipulation module | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// This module provides macros to assist with continuations. The most widely-known case of continuation manipulation is probably continuation-passing-style conversion, which you use when you do
// nonblocking things such as AJAX. In this case the callback function is the continuation of the call. (I'm not going to fully explain continuations here, but
// http://en.wikipedia.org/wiki/Continuation is a good if intimidating place to start if you're into functional programming -- which I assume you are if you're using Caterwaul :).)

  caterwaul.configuration('continuation.core', function () {this.shallow('continuation', {})}).

// Unwind protection.
// This is how you can implement error handling. You can intercept both the normal and the escaping cases and specify a return value for each alternative. Unwind-protect ultimately compiles into
// a try/catch. Also provided is the unwind[] macro, which causes an unwind through any call/cc operations until an unwind-protect is hit or the toplevel is reached, in which case it shows up as
// an error. unwind[x] is exactly equivalent to (function () {throw x})().

// Unwind-protect is of this form:

// | unwind_protect[<escape>][<body>]      // === caterwaul.continuation.unwind_protect(fn[e][<escape>], fn_[<body>])

// The escape block will be run if any abnormal escaping is being performed (e.g. escaping via call/cc, unwind[], or an exception). Body is executed regardless, and if it returns normally then
// its return value is the return value of the unwind_protect block. The escape block can refer to 'e', the escaping value. 'this' is preserved in the body and escape blocks.

  tconfiguration('std', 'continuation.unwind', function () {
    this.configure('std.fn continuation.core').continuation /se[_.unwind_protect = function (escape, f) {try {return f()} catch (e) {return escape(e)}},
                                                                _.unwind         = function (e) {throw e}];
    this.rmacro(qs[unwind_protect[_][_]], fn[escape, body][qse[_f(fb[e][_escape], fb_[_body])].replace({_f: new this.ref(this.continuation.unwind_protect), _escape: escape, _body: body})]).
         rmacro(qs[unwind[_]], fn[e][qs[_f(_e)].replace({_f: new this.ref(this.continuation.unwind), _e: e})])}).

// CPS-conversion.
// Converting a whole program to CPS to get re-entrant continuations is a lot of work, so I'm not even trying that. But localized CPS is really useful, especially for nested AJAX calls and such.
// Here's a common example:

// | $.getJSON('some-url', fn[result]
//     [$.getJSON('some-other-url-#{result.property}', fn[other_result][...])]);

// Rather than dealing with this nesting explicitly, it's more convenient to use normal l-notation. That's exactly what l/cps does:

// | l/cps[result       <- $.getJSON('some-url', _),
//         other_result <- $.getJSON('some-other-url-#{result.property}', _)]
//   [console.log(result)];

// There are a couple of things to note about this setup. First, the arrows. This is so that your continuations can be n-ary. (Javascript doesn't let you assign into a paren-list.)

// | l/cps[(x, y) <- binary_ajax_call('some-url', _)][...];

// Second, and this is important: l/cps returns immediately with the result of the first continuation-producing expression (so in the above example, the return value of binary_ajax_call would be
// the value of the l/cps[][] block). This has some important ramifications, perhaps most importantly that the code in the block must be side-effectful to be productive. No magic is happening
// here; l/cps ultimately gets translated into the set of nested functions that you would otherwise write.

// As of version 0.5.5 the alternative "l/cps[x <- ...] in f(x)" notation is supported (basically, just like regular let-bindings). It's purely a stylistic thing.

// There's also a shorthand form to CPS-convert functions. If you care only about the first parameter (which is true for a lot of functions), you can use the postfix /cps[] form, like this:

// | $.getJSON('foo', _) /cps[alert(_)];
//   $.getJSON('foo', _) /cps.x[alert(x)];         // Also has named form

// Bound variants of both l/cps and /cps[] are also available:

// | $.getJSON('foo', _) /cpb[...];
//   l/cpb[x <- foo(_)][...];

// The legacy let/cps and let/cpb forms are also supported for backwards compatibility.

// There's an interesting scoping bug in Caterwaul <= 0.5.1. Suppose you have a form that binds _ in some context, but doesn't intend for it to be a continuation; for example:

// | f(seq[xs *[_ + 1]], _) /cps[...];

// In this case, _ + 1 is supposed to use the implicitly-bound _, not the outer continuation callback. However, the old continuation logic was perfectly happy to rewrite the term with two
// continuation functions, a semantic disaster. What happens now is a regular lexical binding for _, which has the added benefit that multiple _'s in continuation-rewriting positions will refer
// to the same callback function rather than multiply-evaluating it (though I'm not sure this actually matters...).

  tconfiguration('std', 'continuation.cps', function () {
    l*[cps_convert(v, f, b, bound) = qse[l[_ = _c][_f]].replace({_c: caterwaul.macroexpand(qs[_f[_v][_b]].replace({_f: bound ? qs[fb] : qs[fn]})).replace({_v: v.as('(')[0], _b: b}), _f: f}),

         l_cps_def(t, form, bound) = l[inductive(cs, v, f, b) = qs[l/cps[cs][_f]].replace({cs: cs, _f: cps_convert(v, f, b, bound)}), base(v, f, b) = cps_convert(v, f, b, bound)] in
                                     t.rmacro(qs[l/_form[_, _ <- _] in _].replace({_form: form}), inductive).rmacro(caterwaul.parse('let/#{form.serialize()}[_, _ <- _] in _'), inductive).
                                       rmacro(qs[l/_form[   _ <- _] in _].replace({_form: form}), base)     .rmacro(caterwaul.parse('let/#{form.serialize()}[   _ <- _] in _'), base).
                                       rmacro(qs[l/_form[_, _ <- _][_]]  .replace({_form: form}), inductive).rmacro(caterwaul.parse('let/#{form.serialize()}[_, _ <- _][_]'),   inductive).
                                       rmacro(qs[l/_form[   _ <- _][_]]  .replace({_form: form}), base)     .rmacro(caterwaul.parse('let/#{form.serialize()}[   _ <- _][_]'),   base),

         cps_def(t, form, bound)   = t.rmacro(qs[_ /_form[_]].  replace({_form: form}), fn[f, b][qse[_f /_form._[_b]].replace({_form: form, _f: f, _b: b})]).
                                       rmacro(qs[_ /_form._[_]].replace({_form: form}), fn[f, v, b][qse[l[_ = _c][_f]].replace(
                                         {_c: caterwaul.macroexpand(qs[_f[_v][_b]].replace({_f: bound ? qs[fb] : qs[fn]})).replace({_v: v, _b: b}), _f: f})])] in

    this.configure('std.fn continuation.core') /se[cps_def(_, qs[cps], false), cps_def(_, qs[cpb], true), l_cps_def(_, qs[cps], false), l_cps_def(_, qs[cpb], true)]}).

// Escaping continuations and tail call optimization.
// The most common use for continuations besides AJAX is escaping. This library gives you a way to escape from a loop or other function by implementing a non-reentrant call/cc. You can also use
// tail-call-optimized recursion if your functions are written as such.

// | call/cc[fn[cc][cc(5)]]        // returns 5
//   call/cc[fn[cc][cc(5), 6]]     // still returns 5
//   call/cc[fn[cc][19]]           // returns 19

// Tail calls must be indicated explicitly with call/tail. (Otherwise they'll be regular calls.) For example:

// | var factorial_cps = fn[n, acc, cc][n > 0 ? call/tail[factorial_cps(n - 1, acc * n, cc)] : call/tail[cc(acc)]];
//   call/cc[fn[cc][factorial_cps(5, 1, cc)]];   // -> 120

// In this example it's also legal to call the final continuation 'cc' normally: cc(acc). It's faster to use call/tail[cc(acc)] though. Importantly, continuations lose their bindings! This means
// that tail-calling a method won't do what you want:

// | call/tail[object.method(5)]   // calls object.method with wrong 'this'

// What you can do instead is eta-expand or use Caterwaul's /mb notation (note the extra parens; they're necessary, just as they would be if you were invoking an /mb'd method directly):

// | call/tail[fn[x][object.method(x)](5)];
//   call/tail[(object/mb/method)(5)];             // At this rate you're probably better off using the call_tail function directly.

// Either of these will invoke object.method in the right context.

// Delimited continuations work because call/cc uses an internal while loop to forward parameters outside of the tail call. This keeps the stack bounded by a constant. Note that tail calls work
// only inside a call/cc context. You can use them elsewhere, but they will not do what you want. Also, tail calls really do have to be tail calls. You need to return the call/tail[...]
// expression in order for it to work, just like you'd have to do in Scheme or ML (except that in JS, return is explicit rather than implicit).

// Note that call/cc and call/tail are macros, not functions. The functions are available in normal Javascript form, however (no deep macro-magic is ultimately required to support delimited
// continuations). call/cc is stored as caterwaul.continuation.call_cc, and call/tail is caterwaul.continuation.call_tail. The invocation of call_tail is different from call/tail:

// | caterwaul.continuation.call_tail.call(f, arg1, arg2, ...);

  tconfiguration('std', 'continuation.delimited', function () {
    l[magic = this.configure('continuation.core').continuation.magic = this.magic('continuation.delimited')] in
    this.continuation /se[_.call_cc     = function (f) {var escaped = false, cc = function (x) {escaped = true; throw x}, frame = {magic: magic, continuation: f, parameters: [cc]};
                                                        try       {while ((frame = frame.continuation.apply(this, frame.parameters)) && frame && frame.magic === magic); return frame}
                                                        catch (e) {if (escaped) return e; else throw e}},
                          _.call_tail() = {magic: magic, continuation: this, parameters: arguments}];

    this.rmacro(qs[call/cc[_]],      fn[f]      [qs[qg[_call_cc.call(this, _f)]].   replace({_call_cc:   new this.ref(this.continuation.call_cc),   _f: f})]).
         rmacro(qs[call/tail[_(_)]], fn[f, args][qs[qg[_call_tail.call(_f, _args)]].replace({_call_tail: new this.ref(this.continuation.call_tail), _f: f, _args: args})])}).

// End-user library.

  configuration('continuation', function () {this.configure('continuation.core continuation.unwind continuation.cps continuation.delimited')});
// Generated by SDoc 
