// JIT macroexpander with probabilistic modeling.
// The naive macroexpander, implemented in sdoc::js::core/caterwaul.macroexpander.naive, takes linear time both in the number of syntax nodes and the number of macros. For potentially deep
// pattern trees this becomes too slow for regular use. This macroexpander uses just-in-time compilation to optimize lookups against the macro table, eliminating most of the checks that would
// have failed.

//   Algorithm and use case analysis.
//   For n syntax nodes and k macro patterns, a naive approach performs O(nk) tree-match operations. Each match is O(n) in the complexity of the pattern tree. At first it seemed like this would
//   scale reasonably well, but version 0.6.7 of Caterwaul performed 750000 tree-match operations to load just the standard libraries. This ended up taking several seconds on some runtimes.

//   Implementation approaches.
//   Obviously it isn't terribly feasible to index every syntax node in every way, since we'll discover useful information about it just by querying its data. At that point we will have
//   partitioned the macro-space to a smaller subset, and some other test will then serve to partition it further. In general this procedure would be quite slow; there's a lot of decision-making
//   going on here. However, this overhead vanishes if, rather than using higher-order logic to construct the match function, we instead compile one tailored to the macro set. (Caterwaul /is/ a
//   runtime compiler, after all :). In the case of the standard library (module 'std') we'd have something like this:

//   | var t1 = tree;
//     if (! t1) return false;                                             // Fail quickly if nodes don't exist
//     switch (t1.data) {                                                  // Check toplevel node -- this is the cheapest check we can do right now
//       case '*':
//         var t2 = t1[0];
//         if (! t2) return false;
//         switch (t2.data) {                                              // Check next node down
//           case 'let':
//             var t3 = t1[1];
//             if (! t3) return false;
//             var t4 = t3[0];
//             if (! t4) return false;
//             if (t3.data === '[]' && t4.data === '[') {                  // Just one pattern case left, so verify that the other elements match up
//               var p = [t4[0], t3[1]];                                   // Either of these can be undefined
//               return macroexpander_1.apply(this, p) || macroexpander_2.apply(this, p) || ...;
//             } else
//               return false;
//           // ...

//   This strategy is ideal because it performs inexpensive checks first, then dives down to do the more time-consuming ones. It also has the benefit that failover cases are still preserved; a
//   macro that returns a falsy replacement will trigger the next macro in the series, finally failing over to no alteration. This is done in what I believe to be the fastest possible way.

//   Note that I've omitted arity checks in the code above. This is generally safe to do; the alternative is to bail on unexpectedly undefined values, which is happening. However, it doesn't
//   handle the case where there is extra data on a node for whatever reason. The real macroexpander has one final check to make sure that the arity of each non-wildcard node matches the pattern.

//   Each decision costs a certain amount. Based on some benchmarks I've run that amount seems to be bounded in the length of the cases rather than the selector (see
//   hackery/macroexpander-indexing/switch-strings.js for details), which is ideal. However, V8 has a minor pathological inefficiency case with long selectors and many cases. (It doesn't seem to
//   optimize away some cases by using a failing length check.) Because of this, each switch statement needs to be guarded by a maximum-length check. Any strings longer than the maximum are
//   automatically discarded, since they would be (1) expensive to check in the worst case, and (2) they would fail each check anyway. (It's also cheap to do a length check because all of the
//   lengths are already known at compile-time.)

//   Constructing the decisions.
//   It would be fun to have some complex solver to build the decision tree, but I'm not convinced that one is necessary. Rather, I think a simple heuristic approach will work just fine. The
//   reason is that each decision level involves the same amount of complexity (and it's fairly cheap), so doing one to save one is perfectly valid. This means that there isn't a particularly
//   good reason to reduce the number of decisions when there are in fact a lot of cases.

//   Here are the important scenarios to consider:

//   | 1. The pattern space is uniform in its data. In this case, we skip the check (since it doesn't tell us anything) and descend into the next level.
//     2. The pattern space is partially decided by its data. In this case, construct a decisional and split the pattern space.
//     3. The pattern space is partially undefined. This happens if one of the patterns has '_' as its data, for instance.
//     4. The pattern space is completely undefined. This happens if each pattern has '_' as its data.

//   Cases (3) and (4) are not as simple as (1) and (2). If two macros overlap, they need to be tried in the right order (which in this case is backwards from the order they appear in the macro
//   array). So each wildcard within the pattern space partitions the patterns into those which should be matched before and those which should be matched after. For example, suppose we have
//   three patterns in this order:

//   | ([] (let) (_))
//     ([] (_) (_))
//     ([] (where) (_))

//   Note that unfortunately we can't remove the ([] (let) (_)) macro because the ([] (_) (_)) macro might reject the match for whatever reason. So despite the fact that technically the more
//   specific pattern is shadowed by a more general one we can't optimize that case.

//   They all start with the same thing so we generate a quick-failure check and build conditionals on [0]. Here's the condition tree after partitioning (arity checks and intermediate variables
//   elided):

//   | switch (t1.data) {                  // Compare the initial data first; this gives us a quick failure case for non-matching nodes
//       case '[]':
//         switch (t2.data) {case 'where': if (solution = macroexpander_for_where([t1[1]])) return solution}
//         if (solution = macroexpander_for_wildcard([t1[1]])) return solution;
//         switch (t2.data) {case 'let': if (solution = macroexpander_for_let([t1[1]])) return solution}
//     }

//   Pathological cases like this will sometimes happen, but most of the time macro patterns will be more sensible. In particular, most macros share forms in practice, which decreases the
//   likelihood that anything bizarre like this will occur.

//   So far I've portrayed the decisional tree construction as being a mostly linear process, but this isn't the case in practice. The reason is that at some point we have to decide which child
//   to descend to next, or whether to do a parallel navigation or some such. To do this effectively we need an estimated-cost function.

//     Computing estimated cost.
//     Rather than introducing the variable of information-gained into the equation, I'm keeping it simple by assuming that we must reduce the search space down to a single item. Therefore the
//     only relevant question is how much effort is required to do this. Luckily this is fairly straightforward to figure out. We just need to make some simplifying assumptions.

//     | 1. Comparison on a node is about as expensive as visiting the node in the first place.
//       2. Identifier nodes have much higher information density than operator nodes, and identifier nodes never have children. For concreteness' sake, let's assume that there are 100
//          identifiers and 20 operators. (See 'Probabilistic modeling' for details about how a more realistic model is constructed.)

//     It's possible to conclude a few things from these rules:

//     | 1. It always makes sense to perform a comparison. If each possibility is equally likely, then odds are 1/20 that each case will be taken; so either (1) we partition the space (which is
//          useful), or (2) we abandon the search with likelihood 19/20 (which is really useful).
//       2. We should perform comparisons in whichever order minimizes the expected number of future comparisons.

//     An alternative to the uniformity assumption is to actually go through the syntax tree up-front and count the number of occurrences of each possibility. This way we have an order-1
//     probability model to work with to better judge the accuracy of each decisional. The cost of constructing this model is 2n in the tree size; one factor of n for visits, the other factor of
//     n for the hashtable lookups involved in counting. (I'm deliberately being vague about the exact cost of these things, since it varies a lot depending on the runtime.)

//     In order for this to be justifiable it would have to then save an expected two operations per node. Considering the highly nonuniform occurence of Javascript operators, I'd say this is
//     easily possible.

//     Probabilistic modeling.
//     For simplicity's sake I don't want to dive down the context-ful rabbit hole yet. This probability model uses only two contexts: The node has children, or the node does not have children.
//     (This actually is an important distinction, since in Javascript only operators can have children.) So we end up with two probability check functions:

//     | P(node.data === 'whatever' | node has children)
//       P(node.data === 'whatever' | node has no children)

//     There are some optimizations that are possible when building these tables. One is that only the symbols mentioned in any of the macro patterns need to be counted; other ones can be added
//     to the total but otherwise ignored. The other, which follows from the first, is that we can do a preliminary symbol length check to avoid unnecessary string comparisons. (The hash()/has()
//     mechanism actually does this for us.)

      construct_symbol_table = function (macro_patterns) {
        var symbols = {}, max_length = 0;
        for (var i = 0, l = macro_patterns.length; i < l; ++i) node_patterns[i].reach(function (node) {var d = node.data; symbols[d] = true; d.length > max_length && (max_length = d.length)});
        symbols[max_length_gensym] = max_length;
        return symbols},

      construct_probability_models = function (macro_patterns, tree) {
        var symbols = construct_symbol_table(macro_patterns), l0 = {}, l0_total = 0, ln = {}, ln_total = 0;
        tree.reach(function (node) {var d = node.data; if (has(symbols, d)) if (node.length) {++ln_total; ln[d] = (ln[d] || 0) + 1} else {++l0_total; l0[d] = (l0[d] || 0) + 1}});
        for (var k in l0) l0[k] /= l0_total;
        for (var k in ln) ln[k] /= ln_total;
        return {p0: l0, pn: ln}},

//     Note that I'm not checking for hasOwnProperty in the division loops. The reason is that IE has a bug that makes hasOwnProperty return false for members of the prototype. This means that
//     for things like toString, hasOwnProperty, etc. we would fail to divide, yielding insane (> 1) probabilities for these attributes. The alternative case is to divide some functions by
//     numbers, which results in NaN being assigned. (This happens in the pathological case that someone has extended Object.prototype.) Even this isn't that bad, though, because (1) we will
//     never access those properties anyway, and (2) the objects with NaN properties don't escape for the user to access either.

//     Tree weighting.
//     Once we have an estimated cost function for a single level, we'll need to apply it recursively (and hopefully memoize the process so it isn't exponential-time). The idea is to, at each
//     point, make a decision that will minimize the total expected number of decisions and macroexpand calls after that. So, for example:

//     | ([] (let) (_))
//       ([] (where) (_))

//     The tree's weight is calculated like this. First, both start with a common prefix of [], which has probability p1. Given that the tree matches this, the [0] node will be 'let' with
//     probability p2 and 'where' with probability p3. Each check involves exactly one decision, so the total weight is d1 + p1 * d2. (Remember that we're counting the expected number of
//     decisions, so we add one for each comparison and ignore cases for which no further decisions need to be made.) A more interesting case arises here:

//     | ([] (let) (= (_) (_)))
//       ([] (let) (== (_) (_)))
//       ([] (where) (_))

//     The weights of these trees are different. If p1 = p('[]'), p2 = p('let'), p3 = p('where'), p4 = p('='), and p5 = p('=='), then the total weight of deciding the set totals up to d1 + p1 *
//     (d2 + p2 * d3). Here, d1 is the decision cost of ascertaining that the tree data is [], d2 is the decision cost of identifying 'let' vs 'where', and d3 is the cost of identifying '=' vs
//     '=='.

//     Here's how the algorithm gets applied. Suppose we want have these macro patterns:

//     | ([] (let) (= (_) (_)))
//       ([] (let) (== (_) (_)))
//       ([] (where) (= (_) (_)))
//       ([] (where) (in (_) (_)))

//     And we want to find the optimal search strategy. We first accept a decision on the top node, producing a weight of d1. Then we consider the weight of the left and right subtrees
//     independently. Deciding the left subtree yields two sets:

//     | (= (_) (_)) and (== (_) (_))   with probability p('let')
//       (= (_) (_)) and (in (_) (_))   with probability p('where')

//     We then compute the weight of each of these sets and multiply by the probabilities:

//     | d2 * p('let')
//       d3 * p('where')

//     This sum then is the weight of taking the [0] subtree. We then do the same process for the [1] subtree:

//     | (let) and (where)              with probability p('=')
//       (let)                          with probability p('==')
//       (where)                        with probability p('in')

//     Assigning decisional costs:

//     | d2 * p('=')
//       d3 * p('==')
//       d4 * p('in')

//     And sum to get the total weight of taking the [1] subtree. Note that d3 and d4 are nonzero! This is because we have to verify them prior to knowing whether to accept the pattern or return
//     false. It is easily possible that taking the [1] subtree is therefore more expensive than taking the [0] subtree, since switch() can be assumed to be slightly sublinear in the number of
//     cases. Given these weights we take the [0] subtree. It has a cheaper initial decision and a cheaper progression from there.

      treeset_weight = function (trees, weight_of, p0, pn) {
        },

//     Tree partitioning.
//     This is an awkward problem. In the case above, each tree had two sub-trees, which made the partitioning problem straightforward. However, sometimes trees have three sub-trees. This means
//     that after we've decided one of those three we still have two left over. Even though this is arguably a pathological case, it occurs every now and then in regular Javascript. For example:

//     | (? (a) (=  (a) (_)) (=  (b) (_)))
//       (? (a) (== (c) (_)) (== (b) (_)))
//       (? (b) (=  (a) (_)) (== (a) (_)))

//     Deciding subtree [0] produces two partitions:

//     | (? (= (a) (_)) (= (b) (_))) and (? (== (c) (_)) (== (b) (_)))             with probability p('a')
//       (? (= (a) (_)) (== (a) (_)))                                              with probability p('b')

//     At this point we have two different decisional processes, as usual. The second case just requires verification.

      maximum_subtree_index = function (trees)          {for (var r = 0,  i = 0, l = trees.length, li;   i < l; ++i) li = trees[i].data.length, li > r && (r = li); return r},
      subtree_partitions    = function (trees, subtree) {for (var r = {}, i = 0, l = trees.length, d, t; i < l; ++i) (d = (t = trees[i])[subtree]) ? (d = d.data) : (d = ''),
                                                                                                                     (r[d] || (r[d] = [])).push(t); return r},

//     Decision weighting.
//     Conditional structures need to be sorted to minimize the expected number of comparisons. For example, suppose P(foo) is 0.3 and P(bar) is 0.1. Then the switch() between them should list
//     the 'foo' case before the 'bar' case. (Note that length, which bounds the cost of a single string comparison, is irrelevant; the number of characters we compare if the strings don't match
//     can be assumed to be very small.) This provides a nice model for deciding how expensive a decision is too. For example:

//     | switch (x) {
//         case 'foo': // ...              <- this happens with probability p('foo')
//         case 'bar': // ...              <- this happens with probability (1 - p('foo')) * p('bar')
//         case 'bif': // ...              <- this happens with probability (1 - p('foo')) * (1 - p('bar')) * p('bif')
//       }

//     The cost of this decision isn't 3. It's 1 * p('foo') + 2 * (1-p('foo'))*p('bar') + 3 * (1-p('foo'))*(1-p('bar'))*p('bif'). This has some interesting consequences, particularly that it is
//     sometimes much cheaper to take a long decision than it is to take a short one. If the probabilities are exceptionally skewed then most decisional processes will be short.

//     The decision_weight function takes an array of choice trees, a function to compute the weight (passed in first-class to permit memoization), the table of order-0 probabilities, and the
//     table of order-N probabilities. (The latter two are computed by construct_probability_models above.) There's an accompanying constant, decision_weight_constant, that exists to approximate
//     the overhead involved in making a decision in the first place. This includes generating/processing the switch() statement and doing the length check.

      optimal_decision_ordering = function (partitions, weight_of, p0, pn) {

      decision_weight_constant = 10,
      decision_weight = function (partitions, weight_of, p0, pn) {
        var p = function (x) {return x.length ? pn[p.data] : p0[p.data]}, sorted = Array.prototype.slice.call(choices).sort(function (x, y) {return p(y) - p(x)}), np = 1, e = 0;
        for (var i = 0, l = sorted.length, si, pi; i < l; ++i) si = sorted[i], pi = p(si), e += np * pi * weight_of(si), np *= (1 - pi);
        return decision_weight_constant + e}
// Generated by SDoc 
