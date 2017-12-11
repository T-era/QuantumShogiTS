/// <reference path='./main.ts' />
/// <reference path='../main.ts' />
/// <reference path='../../../lib/common.d.ts' />

module Rule {
  export module QuantumAction {
    export class Move implements Action<common.Pos> {
      quantum :Quantum
      constructor(quantum :Quantum) {
        this.quantum = quantum;
      }
      prepare(to :common.Pos) :MoveCont {
        var dty = to._y - this.quantum.pos._y;
        var dy = this.quantum.side ? -dty : dty;
        var dx = to._x - this.quantum.pos._x;

        var newPossibility :PieceType[] = [];
        var removedPossibility :PieceType[] = [];
        for (var i = 0, max = this.quantum.possibility.length; i < max; i ++) {
          var poss = this.quantum.possibility[i];
          if (poss.canMoveTo(this.quantum.face, dx, dy)) {
            newPossibility.push(poss);
          } else {
            removedPossibility.push(poss);
          }
        }
        return new MoveCont(
          to,
          this.quantum,
          newPossibility,
          removedPossibility);
      }
    }
    export class MoveCont implements ActionCont {
      to :common.Pos
      who :Rule.Quantum
      newPossibility :PieceType[]
      removedPossibility :PieceType[]

      constructor(to :common.Pos, who :Rule.Quantum, newPossibility :PieceType[], removedPossibility :PieceType[]) {
        this.to = to;
        this.who = who;
        this.newPossibility = newPossibility;
        this.removedPossibility = removedPossibility;
      }

      can() :boolean {
        return this.newPossibility.length > 0;
      }
      do() {
        if (! this.can()) throw 'Illegal call'

        this.who.pos = this.to;
        this.who.possibility = this.newPossibility
        if (this.removedPossibility.length > 0) {
          this.who._listener.Decide(this.who, this.removedPossibility)
        }
      }
    }
  }
}
