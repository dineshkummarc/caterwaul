// Mysterious 'end()' bug

var l = caterwaul.lex;

aeq(l('foo.bar()'), ['foo', '.', 'bar', '(', ')']);
aeq(l('foo.e()'), ['foo', '.', 'e', '(', ')']);
aeq(l('foo.end()'), ['foo', '.', 'end', '(', ')']);

// Generated by SDoc 