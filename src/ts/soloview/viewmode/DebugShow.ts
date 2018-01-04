/// <reference path='./PieceShow.ts' />
/// <reference path='../../../../vendor/PlateEditorTS/src/lib/tools.d.ts' />
/// <reference path='../../../lib/rule.d.ts' />

module SoloView {
  class DebugShow implements SoloView.PieceShow {
    constructor() {}

    drawer(q :Rule.Quantum, centering :boolean = false) {
      return function(ctx :CanvasRenderingContext2D, point :tools.Pointer, conf :tools.DrawConfig) {
        if (q == null) {
          tools.fillRect(ctx, new tools.Pointer(point.cx + 2, point.cy + 2), {width: 98, height: 98}, {});
          return;
        }
        var head :tools.Pointer;
        var lSholder :tools.Pointer;
        var rSholder :tools.Pointer;
        var lFoot :tools.Pointer;
        var rFoot :tools.Pointer;
        var nr :tools.Pointer;
        var cy :number;
        if (centering) {
          point = new tools.Pointer(point.cx - 50, point.cy - 50);
        }
        if (q.side) {
          head = new tools.Pointer(point.cx + 50, point.cy + 10);
          lSholder = new tools.Pointer(point.cx + 35, point.cy + 25);
          rSholder = new tools.Pointer(point.cx + 65, point.cy + 25);
          lFoot = new tools.Pointer(point.cx + 25, point.cy + 90);
          rFoot = new tools.Pointer(point.cx + 75, point.cy + 90);
          nr = new tools.Pointer(point.cx + 45, point.cy + 25);
          cy = 50;
        } else {
          head = new tools.Pointer(point.cx + 50, point.cy + 90);
          lSholder = new tools.Pointer(point.cx + 35, point.cy + 75);
          rSholder = new tools.Pointer(point.cx + 65, point.cy + 75);
          lFoot = new tools.Pointer(point.cx + 25, point.cy + 10);
          rFoot = new tools.Pointer(point.cx + 75, point.cy + 10);
          nr = new tools.Pointer(point.cx + 45, point.cy + 85);
          cy = 25;
        }

        tools.line(ctx, head, lSholder, conf);
        tools.line(ctx, lSholder, lFoot, conf);
        tools.line(ctx, lFoot, rFoot, conf);
        tools.line(ctx, rFoot, rSholder, conf);
        tools.line(ctx, rSholder, head, conf);

        if (q.face != 0) {
          ctx.strokeText('成', nr.cx, nr.cy);
        }
        var l = q.possibility.map(toString);
        var ls = splitBy(3, l);

        ls.forEach(function(str, index) {
          ctx.strokeText(str, point.cx + 30, point.cy + cy + index * 15, 40);
        })
        function splitBy(len :number, l :string[]) {
          var ret = [];
          for (var begin = 0; begin < l.length; begin += len) {
            ret.push(l.slice(begin, begin + len).join(' '));
          }
          return ret;
        }
        function toString(p) {
          if (p == Rule.fu) {
            return 'f';
          } else if (p == Rule.kyo) {
            return 'ko';
          } else if (p == Rule.kei) {
            return 'ki';
          } else if (p == Rule.gin) {
            return 'g';
          } else if (p == Rule.kin) {
            return 'kn';
          } else if (p == Rule.hi) {
            return 'hi';
          } else if (p == Rule.kk) {
            return 'kk';
          } else if (p == Rule.ou) {
            return 'o';
          }
        }
      }
    }
  }
  export var debugShow :SoloView.PieceShow = new DebugShow();
}
