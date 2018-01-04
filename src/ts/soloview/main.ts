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
    cnv :HTMLCanvasElement
    ctx :CanvasRenderingContext2D

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

      var that = this;
      var hov = hover.newHover(this.cnv, {
        dxLeft: 50,
        dxRight: 50,
        dyTop: 50,
        dyBottom: 50 });

      this.cnv.onclick = function(e :MouseEvent) {
        if (that.onHover == null) {
          that.onHover = that.findPieceAt(e);
          hov.setHoverImage(that.pieceShow.drawer(that.onHover, true), e);
        } else {
          // TODO put.
        }
        that.drawAll(that.ctx);
      }
    }
    drawAll(ctx :CanvasRenderingContext2D) {
      this._drawGrid(ctx);
      this._drawOnField(ctx);
      // TODO Draw pieces in hand;
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
          var f = that.pieceShow.drawer(q);
          f(ctx, new tools.Pointer(300 + pos._x * 100, pos._y * 100), {})
        }
      })
    }
    findPieceAt(e :MouseEvent) :Rule.Quantum {
      var poi = tools.toPointer(e, this.cnv);
      if (poi.cx < 300) {
        // inHandF
      } else if (poi.cx < 1200) {
        // field
        var x = Math.floor((poi.cx - 300) / 100);
        var y = Math.floor(poi.cy / 100);
        return this.server.get(new common.Pos(x, y));
      } else if (poi.cx < 1500) {
        // inHandT
      }
      return null;
    }

    setPieceShow(ps :PieceShow) {
      this.pieceShow = ps;

      this.drawAll(this.ctx);
    }
  }
  new Show().setPieceShow(SoloView.debugShow);
}
