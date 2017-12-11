module Rule {
  export class PieceType {
    movation :Movation[][];
    countInSide :number;

    constructor(count :number, mov :Movation[][]) {
      this.movation = mov;
      this.countInSide = count;
    }

    canMoveTo(face :number, dx :number, dy :number) :boolean {
      return this.movation[face].some(function(mov) {
        return mov.isMatch(dx, dy);
      });
    }
  }
  export enum MoveDirection {
    Forward, Side, Backward, SideFront, SideBack
    , KeiSpecial
  }
  export class Movation {
    direction :MoveDirection;
    // 1: 固定1数, 2: 無制限
    size :number;

    constructor(direction :MoveDirection, size :number) {
      this.direction = direction;
      this.size = size;
    }

    isMatch(dx :number, dy :number) :boolean {
      function direction() :MoveDirection {
        if (dy == 2 && (dx == 1 || dx == -1)) {
          return MoveDirection.KeiSpecial;
        } else if (dx == 0) {
          return dy > 0 ? MoveDirection.Forward :
                dy < 0 ? MoveDirection.Backward :
                null;
        } else if (dy == 0) {
          return dx != 0 ? MoveDirection.Side :
                null;
        } else if (Math.abs(dx) == Math.abs(dy)) {
          return dy > 0 ? MoveDirection.SideFront :
            dy < 0 ? MoveDirection.SideBack :
            null;
        }
        return null;
      }

      var dir = direction();
      if (dir == null) {
        return false;
      } else if (dir == MoveDirection.KeiSpecial) {
        return this.direction == MoveDirection.KeiSpecial;
      } else if (dir == this.direction){
        if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
          return true;
        } else {
          return this.size == 2;
        }
      }
      return false;
    }
  }
  var kinMove = [new Movation(MoveDirection.Forward, 1)
      , new Movation(MoveDirection.SideFront, 1), new Movation(MoveDirection.Side, 1)
      , new Movation(MoveDirection.Backward, 1)];
  export var fu = new PieceType(9, [
    [new Movation(MoveDirection.Forward, 1)],
    kinMove
  ]);
  export var kyo = new PieceType(2, [
    [new Movation(MoveDirection.Forward, 2)],
    kinMove
  ]);
  export var kei = new PieceType(2, [
    [new Movation(MoveDirection.KeiSpecial, 1)],
    kinMove
  ]);
  export var gin = new PieceType(2, [
    [new Movation(MoveDirection.Forward, 1), new Movation(MoveDirection.SideFront, 1), new Movation(MoveDirection.SideBack, 1)],
    kinMove
  ]);
  export var kin = new PieceType(2, [kinMove]);
  export var hi = new PieceType(1, [
    [new Movation(MoveDirection.Forward, 2)
      , new Movation(MoveDirection.Side, 2)
      , new Movation(MoveDirection.Backward, 2)],
    [new Movation(MoveDirection.Forward, 2)
      , new Movation(MoveDirection.Side, 2)
      , new Movation(MoveDirection.Backward, 2)
      , new Movation(MoveDirection.SideFront, 1)
      , new Movation(MoveDirection.SideBack, 1)]
  ]);
  export var kk = new PieceType(1, [
    [new Movation(MoveDirection.SideFront, 2)
      , new Movation(MoveDirection.SideBack, 2)],
    [new Movation(MoveDirection.SideFront, 2)
      , new Movation(MoveDirection.SideBack, 2)
      , new Movation(MoveDirection.Forward, 1)
      , new Movation(MoveDirection.Side, 1)
      , new Movation(MoveDirection.Backward, 1)],
  ]);
  export var ou = new PieceType(1, [[new Movation(MoveDirection.Forward, 1)
      , new Movation(MoveDirection.SideFront, 1), new Movation(MoveDirection.Side, 1)
      , new Movation(MoveDirection.SideBack, 1), new Movation(MoveDirection.Backward, 1)]]);

  export var AllPiece = [fu, kyo, kei, gin, kin, hi, kk, ou];
}
