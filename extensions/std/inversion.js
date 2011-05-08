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