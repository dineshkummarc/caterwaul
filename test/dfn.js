// Divergence-style function literal tests

caterwaul.clone('dfn')(function () {
  eq((x >$> x + 1)(5), 6);
  eq((x >$> (y >$> x + y))(6)(7), 13);
  eq(((x, y) >$> x + y)(6, 7), 13);
}) ();

// Generated by SDoc 