// Caterwaul ref library tests

test('caterwaul.std.ref', function () {
  var fn = caterwaul.clone('std macro');
  fn.foo = 'bar';

  var returned_this = fn(function (eq) {
    eq(caterwaul.foo, 'bar');
    caterwaul.foo = 'bif';
    return caterwaul;
  }) (eq);

  fn.macro(fn.parse('foo'), function () {return new this.ref('foo')});
  var macro_value = fn(function (eq) {
    return foo;
  }) (eq);
  eq(macro_value, 'foo');

  fn.rmacro(fn.parse('bar'), function () {return new this.ref('bar')});
  var rmacro_value = fn(function (eq) {
    return bar;
  }) (eq);
  eq(rmacro_value, 'bar');

  var defmacro_value = fn(function (eq) {
    defmacro[bif][fn_[new this.ref('bif')]];
    return bif;
  }) (eq);
  eq(defmacro_value, 'bif');

  eq(fn.foo, 'bif');
  eq(returned_this, fn);
});
// Generated by SDoc 