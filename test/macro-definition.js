// Macro definition tests.

test(function () {
  var c = caterwaul.clone('std.qs', function () {
    this.rmacro(qs[fn[_][_]], function (params, expression) {return qs[function (_) {return _}].s('_', [params, expression])});
  });

  c.configure(function () {
    this.rmacro(qs[let(_ = _) in _], fn[v, e, n][qs[fn[_][_].call(this, _)].s('_', [v, n, e])]);
  });

  eq(c(function () {return fn[x, y][x + y]})()(3, 5), 8);
  eq(c(function () {return let(x = 5) in x + 1})(), 6);
});

// Generated by SDoc 
