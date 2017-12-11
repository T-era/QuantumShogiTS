/// <reference path='../../../lib/control.d.ts' />
/// <reference path='../../../lib/rule.d.ts' />
/// <reference path='../../../lib/common.d.ts' />

module Test {
  export module ControlTest {
    export var all :Test.func[] = [];

    module HandByHand {
      all.push(function(dom) {
        var server :Control.Server = new Control.Server();
        var testCase = new Test.TestCase(dom, 'Server Test 1');
        testCase.show('Step 1st', server.aHandStep(
            true,
            new common.Pos(0, 6),
            new common.Pos(0, 2),
            false),
          false);
        testCase.show('Step 2nd', server.aHandStep(
            false,
            new common.Pos(1, 2),
            new common.Pos(1, 6),
            true),
          false);
        testCase.show('inhand t',
          server.inHandT,
          null,
          function() { return server.inHandT.length == 1; });
        testCase.show('inhand f',
          server.inHandF,
          null,
          function() { return server.inHandF.length == 1; });
      });

      all.push(function(dom) {
        var server :Control.Server = new Control.Server();
        var testCase = new Test.TestCase(dom, 'Server Test 2');
        testCase.show('Step 1st', server.aHandStep(
            true,
            new common.Pos(0, 6),
            new common.Pos(0, 5),
            false),
          false);
        testCase.show('Step 2nd', server.aHandStep(
            false,
            new common.Pos(1, 2),
            new common.Pos(1, 3),
            false),
          false);
        testCase.show('Step 3rd', server.aHandStep(
            true,
            new common.Pos(0, 5),
            new common.Pos(0, 4),
            false),
          false);
        testCase.show('Step 4th', server.aHandStep(
            false,
            new common.Pos(1, 3),
            new common.Pos(1, 4),
            false),
          false);
        testCase.show('inhand t',
          server.inHandT,
          null,
          function() { return server.inHandT.length == 0; });
        testCase.show('inhand f',
          server.inHandF,
          null,
          function() { return server.inHandF.length == 0; });
      });

      all.push(function(dom) {
        var server :Control.Server = new Control.Server();
        var testCase = new Test.TestCase(dom, 'Server Test 3');
        testCase.show('Step 1st', server.aHandStep(
            true,
            new common.Pos(0, 6),
            new common.Pos(0, 2),
            false),
          false);
        var qInHand = server.get(new common.Pos(0, 2));
        testCase.show('Step 2nd take', server.aHandStep(
            false,
            new common.Pos(1, 2),
            new common.Pos(0, 2),
            false),
          false);
        testCase.show('Step 3rd', server.aHandStep(
            true,
            new common.Pos(1, 6),
            new common.Pos(1, 5),
            false),
          false);
        server.aHandPut(
            false,
            qInHand,
            new common.Pos(4, 4));
        testCase.show('Step 5th', server.aHandStep(
            true,
            new common.Pos(2, 6),
            new common.Pos(2, 5),
            false),
          false);
        testCase.show('Step 6th as hi', server.aHandStep(
            false,
            new common.Pos(4, 4),
            new common.Pos(6, 4),
            false),
          false);
        testCase.show('true side no hi',
          server.originT.pieces.map(function(q) {
            return ((q.possibility.length == 1
                && q.possibility[0] == Rule.hi
                && q.side == false)
              || (! Rule.contains(q.possibility, Rule.hi))
            );
          }),
          null,
          function(boolList) {
            return boolList.reduce(function(a, b) {
              return a && b;
            });
          });
        testCase.show('inhand t',
          server.inHandT,
          null,
          function() { return server.inHandT.length == 1; });
        testCase.show('inhand f',
          server.inHandF,
          null,
          function() { return server.inHandF.length == 0; });
      });
    }

    module Finish {
      all.push(function(dom) {
        var server :Control.Server = new Control.Server();
        var isFinished = false;
        server.setCallbacks(function() {}, function() { isFinished = true; });
        var p = function(x, y) { return new common.Pos(x, y); };
        var allPos = [
          p(0,6),p(1,6),p(2,6)  // gin, gin, ou
        ];
        function _moveTo(side, from, dx, dy, reface) {
          var to = p(from._x + dx, from._y + dy);
          server.aHandStep(side, from, to, reface);
          from._x = to._x;
          from._y = to._y;
        }

        var pRiv = p(1, 1);
        allPos.forEach(function(pos) {
          _moveTo(true, pos, 1, -1, false);
          _moveTo(false, pRiv, 1, 0, false);
        });
        allPos.forEach(function(pos) {
          _moveTo(true, pos, -1, 1, false);
          _moveTo(false, pRiv, -1, 0, false);
        });
        for(var i = 0; i < 3; i ++) {
          allPos.forEach(function(pos) {
            _moveTo(true, pos, 0, -1, false);
            if (i % 2 == 0) {
              _moveTo(false, pRiv, 1, 0, false);
            } else {
              _moveTo(false, pRiv, -1, 0, false);
            }
          });
        }
        var testCase = new Test.TestCase(dom, 'Server Test Fin');
        _moveTo(true, allPos[0], 0, -1, true);
        testCase.show('Refece to become gin',
          null,
          null,
          function() { return ! isFinished; });
        _moveTo(false, pRiv, 1, 0, false);

        _moveTo(true, allPos[1], 0, -1, true);
        testCase.show('Refece to become gin',
          null,
          null,
          function() { return ! isFinished; });
        _moveTo(false, p(2, 2), 0, 1, false);
        testCase.show('Remains is ou',
          null,
          null,
          function() { return isFinished; });
      });
    }
  }
}
