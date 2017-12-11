module common {
  export class Pos {
    _x :number;
    _y :number;

    constructor(x, y) {
      this._x = x;
      this._y = y;
    }

    equals(arg :Pos) :boolean {
      return (this._x == arg._x
          && this._y == arg._y);
    }
  }
}
