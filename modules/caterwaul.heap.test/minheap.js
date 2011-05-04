// Minheap tests.

test('caterwaul.heap.minheap', function () {
  var c = caterwaul.clone('std heap');
  c(function (eq) {
    var minheap = caterwaul.heap(fn[x, y][x < y]);
    var h = new minheap();
    eq(h.insert(8).root(), 8);
    eq(h.insert(5).root(), 5);
    eq(h.insert(3).root(), 3);
    eq(h.insert(7).root(), 3);
    eq(h.insert(2).root(), 2);
    eq(h.rroot(), 2);
    eq(h.rroot(), 3);
    eq(h.rroot(), 5);
    eq(h.rroot(), 7);
    eq(h.rroot(), 8);
    eq(h.size(), 0);
  })(eq);
});
// Generated by SDoc 