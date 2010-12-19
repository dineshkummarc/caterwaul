// CPS-conversion tests.

test(function () {
  var c = caterwaul.clone('std continuation');
  c(function (eq) {
    var x  = 0;
    var cs = [];
    var f  = cs/mb/push;
    var g  = fn_[cs.shift().apply(this, arguments)];

    eq(let/cps[y <- f(_)][x += y], 1);
    eq(x, 0);
    eq(cs.length, 1);
    g(10);
    eq(x, 10);
    eq(cs.length, 0);

    eq(let/cps[y <- f(_), z <- f(_)][x += y + z], 1);
    eq(x, 10);
    eq(cs.length, 1);
    g(7);
    eq(x, 10);
    eq(cs.length, 1);
    g(4);
    eq(x, 21);
    eq(cs.length, 0);

    var s = '';
    eq(let/cps[(foo, bar) <- f(_)][s += foo + bar], 1);
    eq(s, '');
    eq(cs.length, 1);
    g('one', 'two');
    eq(s, 'onetwo');
    eq(cs.length, 0);
  })(eq);

  c(function (eq) {
    var f = fn[x, g, y][g.call(10, x + y)];
    var count = 0;
    var t = this;
    f(3, _, 5) /cps[++count, eq(_, 8), eq(this, 10)];
    f(3, _, 5) /cpb[++count, eq(_, 8), eq(this, t)];
    eq(count, 2);

    f(4, _, 9) /cps.n[++count, eq(n, 13), eq(this, 10)];
    f(4, _, 9) /cpb.n[++count, eq(n, 13), eq(this, t)];
    eq(count, 4);
  })(eq);
});

// Generated by SDoc 
