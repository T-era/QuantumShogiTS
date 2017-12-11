/// <reference path='./main.ts' />
/// <reference path='../main.ts' />
/// <reference path='../../../lib/common.d.ts' />

module Rule {
  export module QuantumAction {
    export class Reface implements Action<void> {
      quantum :Quantum;

      constructor(quantum :Quantum) {
        this.quantum = quantum;
      }
      prepare() :RefaceCont {
        return new RefaceCont(this.quantum);
      }
    }
    export class RefaceCont implements ActionCont {
      quantum :Rule.Quantum

      constructor(quantum :Rule.Quantum) {
        this.quantum = quantum;
      }

      can() :boolean {
        var q = this.quantum;
        return q.possibility.some(function(poss) {
          return poss.movation.length > q.face + 1;
        });
      }
      do() {
        if (! this.can()) throw 'Illegal call';

        var canRefacePossibility :PieceType[] = [];
        var removingPossibility :PieceType[] = [];
        var q = this.quantum;
        q.possibility.forEach(function(poss) {
          if (poss.movation.length > q.face + 1) {
            canRefacePossibility.push(poss);
          } else {
            removingPossibility.push(poss);
          }
        });

        if (canRefacePossibility.length > 0) {
          q.face ++;
          q.possibility = canRefacePossibility;

          // refaceできないpossibilityは消滅する
          if (removingPossibility.length > 0) {
            q._listener.Decide(q, removingPossibility);
          }
        } else {
          throw "???";
        }
      }
    }
  }
}
