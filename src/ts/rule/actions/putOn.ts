/// <reference path='./main.ts' />
/// <reference path='../main.ts' />
/// <reference path='../../../lib/common.d.ts' />

module Rule {
  export module QuantumAction {
    export class PutOn implements Action<common.Pos> {
      quantum :Quantum;
      constructor(quantum :Quantum) {
        this.quantum = quantum;
      }
      prepare(to :common.Pos) :ActionCont {
        if (this.quantum.pos != null) {
          return FalseCont;
        }

        var edgeLine :number[];
        if (this.quantum.side) {
          edgeLine = [0, 1];
        } else {
          edgeLine = [8, 7];
        }

        var forbidden :PieceType[];
        if (to._y == edgeLine[0]) {
          forbidden = [Rule.fu, Rule.kyo, Rule.kei];
        } else if (to._y == edgeLine[1]) {
          forbidden = [Rule.kei];
        } else {
          forbidden = [];
        }

        return new PutOnCont(to, this.quantum, forbidden);
      }
    }
    export class PutOnCont implements ActionCont {
      to :common.Pos
      who :Quantum
      forbidden :PieceType[]

      constructor(to :common.Pos, who :Quantum, forbidden :PieceType[]) {
        this.to = to;
        this.who = who;
        this.forbidden = forbidden;
      }

      can() :boolean {
        if (this.forbidden.length > 0) {
          var that = this;
          return this.who.possibility.some(function(poss) {
            return !contains(that.forbidden, poss);
          });
        } else {
          return true;
        }
      }
      do() {
        if (! this.can()) throw 'Illegal call'

        if (this.forbidden.length > 0) {
          var newPossibility :PieceType[] = [];
          var removedPossibility :PieceType[] = [];
          var that = this;
          this.who.possibility.forEach(function(poss) {
            if (contains(that.forbidden, poss)) {
              removedPossibility.push(poss);
            } else {
              newPossibility.push(poss);
            }
          });
          this.who.pos = this.to;
          if (removedPossibility.length > 0) {
            this.who.possibility = newPossibility

            this.who._listener.Decide(this.who, removedPossibility)
          }
        } else {
          this.who.pos = this.to;
        }
      }
    }
  }
}
