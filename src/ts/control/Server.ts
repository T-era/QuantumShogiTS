/// <reference path='../../lib/rule.d.ts' />
/// <reference path='../../lib/common.d.ts' />

module Control {
  export type FieldShow = (pos :common.Pos, q :Rule.Quantum)=>void
  export type TurnChangeCallback = (sideInTern :boolean)=>void
  export type GOverCallback = (sideWin :boolean)=>void

  export interface ServerInterface {
    setCallbacks(tcc :TurnChangeCallback, goc :GOverCallback);
    getInTern() :boolean
    show(callback :FieldShow);
    showInHand(side :boolean, callback :(q :Rule.Quantum)=>void);
    get(at :common.Pos) :Rule.Quantum;
    aHandPut(side :boolean, q :Rule.Quantum, to :common.Pos);
    aHandStep(side :boolean, from :common.Pos, to:common.Pos, reface :boolean) :boolean;
  }
  export class Server implements ServerInterface {
    inHandT :Rule.Quantum[]
    inHandF :Rule.Quantum[]
    originT :Rule.Origin
    originF :Rule.Origin

    inTern :boolean
    field :Rule.Quantum[][]

    turnChangeCallback :TurnChangeCallback[];
    gOverCallback :GOverCallback[];

    constructor() {
      this.inTern = true;

      this.field = [];
      for (var y = 0; y < 9; y ++) {
        this.field[y] = [];
        for (var x = 0; x < 9; x ++) {
          this.field[y][x] = null;
        }
      }

      var that = this;
      this.originT = new Rule.Origin(true, function(x, y, q) {
        that.field[y][x] = q;
      });
      this.originF = new Rule.Origin(false, function(x, y, q) {
        that.field[y][x] = q;
      });

      this.inHandT = [];
      this.inHandF = [];

      this.turnChangeCallback = [];
      this.gOverCallback = [];
    }

    setCallbacks(tcc :TurnChangeCallback, goc :GOverCallback) {
      this.turnChangeCallback.push(tcc);
      this.gOverCallback.push(goc);
    }

    getInTern() :boolean {
      return this.inTern;
    }
    show(callback :FieldShow) {
      this.field.forEach(function(line, y) {
        line.forEach(function(q, x) {
          callback(new common.Pos(x, y), q);
        });
      });
    }
    showInHand(side :boolean, callback :(q :Rule.Quantum)=>void) {
      var inHand = side ? this.inHandT : this.inHandF;
      inHand.forEach(callback);
    }

    get(at :common.Pos) :Rule.Quantum {
      return this.field[at._y][at._x];
    }
    aHandPut(side :boolean, q :Rule.Quantum, to :common.Pos) {
      var action = q.putOn.prepare(to);
      if (this.inTern != side) throw 'Not your turn';
      if (q.side != side) throw 'Not your piece';
      if (q.pos != null) throw 'Not in hand';
      if (this.get(to) != null) throw 'Not empty';
      if (! action.can()) throw "Can't put on ...";

      if (side) {
        if (! Rule.contains(this.inHandT, q)) 'Not in in-hand list';
        this.inHandT = this.inHandT.filter(function(qq) { return qq != q; });
      } else {
        if (! Rule.contains(this.inHandF, q)) 'Not in in-hand list';
        this.inHandF = this.inHandF.filter(function(qq) { return qq != q; });
      }

      this.field[to._y][to._x] = q;
      action.do();

      this.turnChange();
    }

    aHandStep(side :boolean, from :common.Pos, to:common.Pos, reface :boolean) :boolean {
      var q = this.get(from);
      var action = q.move.prepare(to);
      if (this.inTern != side) throw 'Not your turn';
      if (q.side != side) throw 'Not your piece';
      if (! q.pos.equals(from)) throw 'XX Conflict XX';
      if (reface && ! _isEdge(side, to)) throw "Can't reface";
      if (reface && ! q.reface.prepare(void 0).can()) throw "Can't reface";
      if (! action.can()) throw "Can't move-to ...";
      if (this._somethingInside(from, to)) throw "Cant' straddle another piece";

      var toInHand = this.get(to)
      if (toInHand != null) {
        var inHand = side ? this.inHandT : this.inHandF;
        if (toInHand.side == side) {
          throw 'Taking self...'
        }
        toInHand.pos = null;
        toInHand.side = side;
        toInHand.face = 0;
        toInHand.possibility = Rule.remove(toInHand.possibility, Rule.ou);
        inHand.push(toInHand);
      }

      action.do();
      this.field[from._y][from._x] = null;
      this.field[to._y][to._x] = q;
      if (reface) {
        q.reface.prepare(void 0).do();
      }

      var originRival = side ? this.originF : this.originT;
      var result = ! originRival.pieces.some(function(q) {
        return Rule.contains(q.possibility, Rule.ou);
      });
      if (result) {
        this.gOverCallback.forEach(function(goc) {
          goc(side);
        });
      } else {
        this.turnChange();
      }
      return result;
    }

    turnChange() {
      this.inTern = ! this.inTern;
      this.turnChangeCallback.forEach(function(tcc) {
        tcc(this.inTern);
      });
    }

    _somethingInside(from :common.Pos, to :common.Pos) :boolean {
      var dy = to._y - from._y;
      var dx = to._x - from._x;
      var ady = Math.abs(dy);
      var adx = Math.abs(dx);
      if ((ady <= 1 && adx <= 1)
        || (adx == 1 && ady == 2)) return false;
      var big = Math.max(adx, ady);
      for (var i = 1; i < big; i ++) {
        var x = from._x + (dx / big * i);
        var y = from._y + (dy / big * i);

        if (this.get(new common.Pos(x, y))) return true;
      }
      return false;
    }
  }

  function _isEdge(side :boolean, pos :common.Pos) :boolean {
    var edgeLine :number[];
    if (side) {
      edgeLine = [0, 1, 2];
    } else {
      edgeLine = [8, 7, 6];
    }
    return Rule.contains(edgeLine, pos._y);
  }
}
