/// <reference path='../../../lib/rule.d.ts' />

module Test {
  export module RuleTest {
    export module QDecideTest {
      export var all :Test.func[] = [];

      module FullCombinationTest {
        all.push(function(dom) {
          var testCase = new Test.TestCase(dom, 'fullCombination');
          testCase.show('two elements',
            Rule.fullCombination(['a','b']),
            [['a'], ['b'], ['a', 'b']],
            Test.CompareAsJSON);
          testCase.show('three elements',
            Rule.fullCombination(['a','b','c']),
            [['a'], ['b'], ['c'], ['a', 'b'], ['a', 'c'], ['b', 'c'], ['a', 'b', 'c']],
            Test.CompareAsJSON);
        });
      }
      module ContainsTest {
        all.push(function(dom) {
          var testCase = new Test.TestCase(dom, 'contains');
          testCase.show('b in [a,b,c]',
            Rule.contains(['a','b','c'], 'b'),
            true);
          testCase.show('all [b, c] in [a,b,c]',
            Rule.containsAll(['a','b','c'], ['c', 'b']),
            true);
            testCase.show('all [a,b,c] in [a,b,c]',
              Rule.containsAll(['a','b','c'], ['c', 'a', 'b']),
              true);
          testCase.show('all d not in [a,b,c]',
            Rule.containsAll(['a','b','c'], ['c', 'd']),
            false);
        });
      }
      module DecideTest {
        function _moveTo(p, dx, dy) :boolean {
          var cont = p.move.prepare(new common.Pos(p.pos._x + dx, p.pos._y + dy));
          var ret = cont.can();
          if (ret) {
            cont.do()
          }
          return ret;
        }

        all.push(function(dom) {
          var origin = new Rule.Origin(false, function(a, b, c) {});
          var pieces = origin.pieces;
          var pieceA = pieces[0];
          var pieceB = pieces[1];

          var testCase = new Test.TestCase(dom, 'Decide 1');
          testCase.show('Prepare 1(move as kei)',
            _moveTo(pieceA, +1, +2),
            true);
          testCase.show('Prepare 2(move as key)',
            _moveTo(pieceB, +1, +2),
            true);
          testCase.show("Another piece can't kei",
            pieces,
            null,
            function() {
              for (var i = 2, max = pieces.length; i < max; i ++) {
                var test = pieces[i];
                if (Rule.contains(test.possibility, Rule.kei)) {
                  return false;
                }
              }
              return true;
            });
        });
        all.push(function(dom) {
          var origin = new Rule.Origin(false, function(a, b, c) {});
          var pieces = origin.pieces;

          var i = 0;
          var testCase = new Test.TestCase(dom, 'Decide 2');

          testCase.show('Prepare 1(move as kei)',
            _moveTo(pieces[i ++], +1, +2) &&
            _moveTo(pieces[i ++], -1, +2),
            true);
          testCase.show('Prepare 2(move as kyo)',
            _moveTo(pieces[i ++], 0, +2) &&
            _moveTo(pieces[i ++], 0, +4),
            true);
          testCase.show('Prepare 3(move as gin or ou)',
            _moveTo(pieces[i], 0, +1) && _moveTo(pieces[i ++], -1, -1) &&
            _moveTo(pieces[i], 0, +1) && _moveTo(pieces[i ++], +1, -1) &&
            _moveTo(pieces[i], 0, +1) && _moveTo(pieces[i ++], +1, -1),
            true);
          testCase.show('Prepare 4(move as kin)',
            _moveTo(pieces[i], +1, 0) && _moveTo(pieces[i ++], -1, +1) &&
            _moveTo(pieces[i], -1, 0) && _moveTo(pieces[i ++], +1, +1),
            true);
          testCase.show('Prepare 5(move as hi)',
            _moveTo(pieces[i ++], -2, 0),
            true);
          testCase.show('Prepare 6(move as kk)',
            _moveTo(pieces[i ++], -2, +2),
            true);
          testCase.show("Another piece will fu, fixed (or, gin-ou combi)",
            pieces,
            null,
            function() {
              for (var i = 0, max = pieces.length; i < max; i ++) {
                var test = pieces[i];
                if (test.possibility.length == 1
                    || (Rule.contains(test.possibility, Rule.gin)
                      && Rule.contains(test.possibility, Rule.ou))) {
                  // do nothing
                } else {
                  return false;
                }
              }
              return true;
            });
          testCase.show('Gin can reface',
            pieces[4].reface.prepare(null).can() &&
            pieces[5].reface.prepare(null).can() &&
            pieces[6].reface.prepare(null).can(),
            true);
          pieces[4].reface.prepare(null).do();
          pieces[6].reface.prepare(null).do();
          testCase.show("ou can't reface",
            pieces[5].reface.prepare(null).can(),
            false);
          testCase.show("All piece is fixed",
            pieces,
            null,
            function() {
              for (var i = 0, max = pieces.length; i < max; i ++) {
                var test = pieces[i];
                if (test.possibility.length == 1) {
                  // do nothing
                } else {
                  return false;
                }
              }
              return true;
            });
        });
      }
    }
  }
}
