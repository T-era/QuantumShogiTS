/// <reference path="../../lib/common.d.ts" />
/// <reference path="./PieceTypes.ts" />
/// <reference path="./InitLayout.ts" />
/// <reference path="./qDecide.ts" />
/// <reference path="./actions/main.ts" />

module Rule {
  export interface DecisionListener {
    Decide(Piece, dec :PieceType[]) :void;
  }
  export type InitCallback = (x :number, y :number, q :Quantum)=>void
  export class Origin implements DecisionListener {
    _side :boolean;
    pieces :Quantum[];

    constructor(side :boolean, initCallback :InitCallback) {
      this._side = side;

      var temp :Quantum[] = [];
      var that = this;
      Layout.forEach(function(line :boolean[], dy :number) {
        line.forEach(function(is :boolean, x:number) {
          if (is) {
            var y :number;
            if (side) {
              y = 9 - 1 - dy;
            } else {
              y = dy;
            }
            var q = new Quantum(side, that, Rule.AllPiece, new common.Pos(x, y));
            temp.push(q);
            initCallback(x, y, q);
          }
        })
      });
      this.pieces = temp;
    }

    Decide(q :Quantum, dec :PieceType[]) :boolean {
      var ret :boolean;
      var unfixedAll = AllPiece;
      var pd = new Rule.QDecider(
        this.pieces,
        unfixedAll,
        function(q) { return q.possibility; },
        function(q, p) { return q.possibility = p; },
        function(p) { return p.countInSide; });

      pd.updateFilled();
      return ret;
    }
  }

  export class Quantum {
    side :boolean;
    possibility :PieceType[];
    pos :common.Pos;
    face :number;

    reface :Rule.QuantumAction.Action<void>;
    putOn :Rule.QuantumAction.Action<common.Pos>;
    move :Rule.QuantumAction.Action<common.Pos>;

    _listener :DecisionListener;

    constructor(side :boolean, listener :DecisionListener, type :PieceType[], pos :common.Pos) {
      this.side = side;
      this._listener = listener;
      this.possibility = type;
      this.pos = pos;
      this.face = 0;

      this.reface = new Rule.QuantumAction.Reface(this);
      this.putOn = new Rule.QuantumAction.PutOn(this);
      this.move = new Rule.QuantumAction.Move(this);
    }
  }
}
