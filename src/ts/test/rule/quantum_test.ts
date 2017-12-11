/// <reference path='../../../lib/rule.d.ts' />
/// <reference path='../../../lib/common.d.ts' />

module Test {
  export module RuleTest {
    export var all :Test.func[] = [];

    module QuantumTest {
      class ListenerMock implements Rule.DecisionListener {
        calledBack :Rule.PieceType[][] = [];

        Decide(q :Rule.Quantum, dec :Rule.PieceType[]) {
          this.calledBack.push(dec);
        }
      }

      function _move(p, pos) {
        var cont = p.move.prepare(pos);
        var ret = cont.can();
        if (ret) {
          cont.do();
        }
        return ret;
      }

      all.push(function(dom) {
        var listener = new ListenerMock();
        var q = new Rule.Quantum(false, listener, Rule.AllPiece, new common.Pos(0, 0));

        var testCase = new Test.TestCase(dom, 'Quantum.move 1');
        testCase.show('move as kei', _move(q, new common.Pos(1, 2)), true);
        testCase.show('result', q.possibility.length, 1);
        testCase.show('result detail', q.possibility[0], Rule.kei);
        testCase.show('callback', listener.calledBack[0].length, 7);
      });
      all.push(function(dom) {
        var listener = new ListenerMock();
        var q = new Rule.Quantum(false, listener, Rule.AllPiece, new common.Pos(0, 0));

        var testCase = new Test.TestCase(dom, 'Quantum.move 2');
        testCase.show('move as kk', _move(q, new common.Pos(2, 2)), true);
        testCase.show('result', q.possibility.length, 1);
        testCase.show('result detail', q.possibility[0], Rule.kk);
        testCase.show('callback', listener.calledBack[0].length, 7);
      });
      all.push(function(dom) {
        var listener = new ListenerMock();
        var q = new Rule.Quantum(false, listener, Rule.AllPiece, new common.Pos(0, 0));

        var testCase = new Test.TestCase(dom, 'Quantum.move 3');
        testCase.show('move to (1,1)', _move(q, new common.Pos(1, 1)), true);
        testCase.show('result', q.possibility.length, 4);
        testCase.show('result detail', null, null, function() {
          return q.possibility.indexOf(Rule.kk) >= 0
          && q.possibility.indexOf(Rule.kin) >= 0
          && q.possibility.indexOf(Rule.gin) >= 0
          && q.possibility.indexOf(Rule.ou) >= 0;
        });
        testCase.show('callback', listener.calledBack[0].length, 4);
      });
      all.push(function(dom) {
        var listener = new ListenerMock();
        var q = new Rule.Quantum(false, listener, Rule.AllPiece, new common.Pos(0, 0));

        var testCase = new Test.TestCase(dom, 'Quantum.move 99');
        testCase.show('move to front', _move(q, new common.Pos(0, 1)), true);
        testCase.show('result', q.possibility.length, 6);
        testCase.show('result detail', null, null, function() {
          return q.possibility.indexOf(Rule.fu) >= 0
          && q.possibility.indexOf(Rule.kyo) >= 0
          && q.possibility.indexOf(Rule.gin) >= 0
          && q.possibility.indexOf(Rule.kin) >= 0
          && q.possibility.indexOf(Rule.hi) >= 0
          && q.possibility.indexOf(Rule.ou) >= 0;
        });
        testCase.show('callback', listener.calledBack[0].length, 2);
        testCase.show("can't move as kei", _move(q, new common.Pos(0+1, 1+2)), false);
        testCase.show("can't move as kk", _move(q, new common.Pos(0+2, 1+2)), false);
        testCase.show('move to front, again', _move(q, new common.Pos(0+0, 1+1)), true);
        testCase.show('(result)', q.possibility.length, 6);
      });
    }
  }
}
