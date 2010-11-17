// Slicing.

test(function () {
  var c = caterwaul.clone('std seq');

  c(function (eq) {
    var naturals = x + 1 <sa< [0];

    var first_few = naturals.first(10);
    eq(first_few.length, 10);
    eq(first_few.at(0), 0);
    eq(first_few.at(1), 1);
    eq(first_few.at(9), 9);
    eq(first_few.at(10), undefined);

    var the_rest = naturals.after(10);
    eq(the_rest.length, Infinity);
    eq(the_rest.at(0), 10);
    eq(the_rest.at(1), 11);
  })(eq);
});

// Generated by SDoc 
