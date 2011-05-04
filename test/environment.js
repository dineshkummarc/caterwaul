// Environment compilation test.
// Makes sure that Caterwaul compiles a function within the right environment.

test('environment', function () {
  var c = caterwaul.clone('std');
  eq(c(function () {return x}, {x: 5})(), 5);
  eq(c(function () {return x}, {x: false})(), false);
  eq(c(function () {return x}, {x: 'foo bar bif'})(), 'foo bar bif');
});
// Generated by SDoc 