// Caterwaul defmacro standard library tests

test(function () {
  var c = caterwaul.clone('std.qs std.qg std.fn std.lvalue std.defmacro std.with_gensyms');

  c(function (eq) {
    eq(defmacro[foo][fn_[qs[bar]]], null);
    var bar = 6;
    eq(foo, 6);
    var x = 3;
    eq(x + 5, 8, 'first');

    eq(defmacro[_ + _][fn[l, r][qs[l * r].replace({l: l, r: r})]], null);
    eq(x + 5, 15, 'second');

    defmacro[loop[_].over[_]][fn[expr, xs][(with_gensyms[i, l, xs][qg[function () {
      for (var i = 0, xs = _array, l = xs.length, it; it = xs[i], i < l; ++i) {_body}}]()]).replace({_array: xs, _body: expr})]];
    var count = 0;
    loop[eq(it, ++count)].over[[1, 2, 3, 4, 5]];
    eq(count, 5);

    var less = fn[x, y][qg[++count, x < y]];
    defsubst[_left < _right][less(_left, _right)];
    eq(5 < 6, true);
    eq(count, 6);

    eq(6 < 5, false);
    eq(count, 7);

    less(x, y) = x > y;
    eq(6 < 5, true);
  }) (eq);
});

// Generated by SDoc 
