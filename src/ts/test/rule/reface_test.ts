/// <reference path='../../../lib/rule.d.ts' />
/// <reference path='../../../lib/common.d.ts' />

module Test {
  export module RuleTest {
    export module RefaceTest {
      export var all :Test.func[] = [];

      function _reface(q :Rule.Quantum) {
        var cont = q.reface.prepare(void 0);
        var ret = cont.can();
        if (ret) {
          cont.do();
        }
        return ret;
      }

      all.push(function(dom) {
        var origin = new Rule.Origin(false, function(a, b, c) {});
        var pieces = origin.pieces;

        var testCase = new Test.TestCase(dom, 'Quantum.reface');
        for (var i = 0, max = pieces.length; i < max; i ++) {
          var q = pieces[i];
          if (i < max - 3) {
            testCase.show('can reface', _reface(q), true);
          } else {
            testCase.show("can't reface", _reface(q), false);
            testCase.show("can't reface because ou or kin", q.possibility, null, function() {
              return (q.possibility.length == 2
                && Rule.containsAll(q.possibility, [Rule.kin, Rule.ou]));
            });
          }
        }
      });
    }
  }
}
