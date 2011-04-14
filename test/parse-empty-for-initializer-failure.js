// Test case for 'for (; foo; bar)' loops (in response to jQuery identity failure)

test('parse-empty-for-initializer-failure', function () {
  var i = function (s)    {eq(s.replace(/[\s\n]/g, ''), caterwaul.parse(s).serialize().replace(/[\s\n]/g, ''))},
      p = function (s, i) {eq(i, caterwaul.parse(s).inspect())};

  p('a;;;', '(; (; (a) (; (<>) (<>))) (<>))');
  p(';a;;', '(; (; (<>) (a)) (; (<>) (<>)))');
  p(';;a;', '(i; (; (<>) (; (<>) (<>))) (; (a) (<>)))');
  p(';;;a', '(; (; (<>) (; (<>) (<>))) (a))');

  p(';;', '(; (<>) (; (<>) (<>)))');
  p('for (;a;b){}', '(for (( (; (; (<>) (a)) (b))) ({))');
  p('for (a;;b){}', '(for (( (i; (; (a) (; (<>) (<>))) (b))) ({))');

  i(';;');
  i('for (;i<l; ++i){}');
  i('for (;; ++i){}');
  i('for (;i<l;){}');
});
// Generated by SDoc 
