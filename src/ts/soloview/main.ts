/// <reference path='../../lib/common.d.ts' />
/// <reference path='../../lib/rule.d.ts' />
/// <reference path='../../lib/control.d.ts' />
/// <reference path='../../../vendor/PlateEditorTS/src/lib/tools.d.ts' />
/// <reference path='../../../vendor/PlateEditorTS/src/lib/hover.d.ts' />
/// <reference path='../../../vendor/PlateEditorTS/src/lib/plates.d.ts' />
/// <reference path='./viewmode/PieceShow.ts' />
/// <reference path='./viewmode/DebugShow.ts' />

module SoloView {
  interface D {
    cnv :HTMLCanvasElement;
    ctx :CanvasRenderingContext2D;
  }
  class Show {
    server :Control.ServerInterface;
    pieceShow :PieceShow = {
      drawer: function() {return function() {}}
    };
    onHover :Rule.Quantum;
    cnv :HTMLCanvasElement;
    ctx :CanvasRenderingContext2D;
    _hov :hover.Hover;

    constructor() {
      this.server = new Control.Server();
      this.server.setCallbacks(
        function() {
          // Tern changed
        },
        function() {
          alert('Finished');
        }
      );

      this.cnv = <HTMLCanvasElement>document.getElementById('canvas');
      this.ctx = this.cnv.getContext('2d');

      this._hov = hover.newHover(this.cnv);

      this.cnv.onclick = this._canvasOnClick.bind(this);
    }
    _canvasOnClick(e :MouseEvent) {
      try {
        var that = this;
        if (this.onHover == null) {
          var hold = this.findPieceAt(e);
          if (hold) {
            if (hold.side != this.server.getInTern()) {
              alert('Not yours!');
              return;
            }
            this.onHover = hold
            this._hov.setHoverImage({
              hover: this.pieceShow.drawer(this.onHover, true),
              width: 100,
              height: 100
            }, e, that.drawAll.bind(that));
            that.drawAll(that.ctx);
          }
        } else {
          var from = this.onHover.pos;
          var to = this.toPos(e);
          if (to == null || to.equals(from)) {
            // cancel
          } else if (from) {
            // move
            var inArea = this.server.getInTern()
                ? (to._y < 3 || from._y < 3)
                : (to._y > 5 || from._y > 5);
            var canReface = (this.onHover.face == 0 && inArea)
            //var refacing = canReface ? confirm('Reface?') : false;
            var result = this.server.aHandStep(this.server.getInTern(), from, to, function() {
              return confirm('Reface?');
            });
            if (result) {
              alert('finish');
            }
          } else {
            // put
            this.server.aHandPut(this.server.getInTern(), this.onHover, to);
          }
          this.onHover = null;
          this._hov.setHoverImage(null, e, that.drawAll.bind(that));
          that.drawAll(that.ctx);
        }
      } catch (ex) {
        alert(ex);
      }
    }
    drawAll(ctx :CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
      this._drawGrid(ctx);
      this._drawOnField(ctx);

      this._drawOnHand(ctx);
    }
    _drawGrid(ctx :CanvasRenderingContext2D) {
      tools.rect(ctx, new tools.Pointer(0, 0), { width: 300, height: 600 }, {});
      tools.rect(ctx, new tools.Pointer(1200, 300), { width: 300, height: 600 }, {});
      tools.rect(ctx, new tools.Pointer(300, 0), { width: 900, height: 900 }, {});
      for (var y = 1; y < 9; y ++) {
        tools.line(ctx, new tools.Pointer(300, 100 * y), new tools.Pointer(1200, 100 * y), {lineDash: [3,3]})
      }
      for (var x = 1; x < 9; x ++) {
        tools.line(ctx, new tools.Pointer(300 + 100 * x, 0), new tools.Pointer(300 + 100 * x, 900), {lineDash: [3,3]})
      }
    }
    _drawOnField(ctx :CanvasRenderingContext2D) {
      var that = this;
      this.server.show(function(pos, q) {
        if (q != null) {
          if (q == that.onHover) {
            // not show
          } else {
            var f = that.pieceShow.drawer(q);
            f(ctx, new tools.Pointer(300 + pos._x * 100, pos._y * 100), {})
          }
        }
      })
    }
    _drawOnHand(ctx :CanvasRenderingContext2D) {
      var that = this;
      [true, false].forEach(function(side) {
        var index = 0;
        var baseX = side ? 1200 : 0;
        var baseY = side ? 300 : 0;
        that.server.showInHand(side, function(q) {
          var f = that.pieceShow.drawer(q);
          var x = baseX + 100 * (index % 3);
          var y = baseY + 100 * (index / 3);
          f(ctx, new tools.Pointer(x, y), {})
        });
      });
    }

    findPieceAt(e :MouseEvent) :Rule.Quantum {
      var pos = this.toPos(e);
      if (pos) {
        // field
        return this.server.get(pos);
      } else {
        var poi = tools.toPointer(e, this.cnv);
        if (poi.cx < 300) {
          // inHandF
          var lx = Math.floor(poi.cx / 100);
          var ly = Math.floor(poi.cy / 100);
          var index = ly * 3 + lx;
          return this.server.getInHand(false, index);
        } else if (poi.cx < 1200) {
        } else if (poi.cx < 1500) {
          // inHandT
          var lx = Math.floor((poi.cx - 1200) / 100);
          var ly = Math.floor((poi.cy - 300) / 100);
          var index = ly * 3 + lx;
          return this.server.getInHand(true, index);
        }
        return null;
      }
    }
    toPos(e :MouseEvent) :common.Pos {
      var poi = tools.toPointer(e, this.cnv);
      if (poi.cx < 300) {
        // inHandF
        return null;
      } else if (poi.cx < 1200) {
        // field
        var x = Math.floor((poi.cx - 300) / 100);
        var y = Math.floor(poi.cy / 100);
        return new common.Pos(x, y);
      } else {
        return null;
      }
    }

    setPieceShow(ps :PieceShow) {
      this.pieceShow = ps;

      this.drawAll(this.ctx);
    }
  }
  new Show().setPieceShow(SoloView.debugShow);
}
