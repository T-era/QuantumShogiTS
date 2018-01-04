/// <reference path='./Server.ts' />

module Control {
  export interface PlayerInterface {
    isMyTurn() :boolean
    show(callback :FieldShow);
    showInHand(callback :(q :Rule.Quantum)=>void);
    get(at :common.Pos) :Rule.Quantum;
    aHandPut(q :Rule.Quantum, to :common.Pos);
    aHandStep(from :common.Pos, to:common.Pos, listenReface :() => boolean) :boolean;
  }

  export class SingleNodePlayer {
    side :boolean;
    server :ServerInterface;

    constructor(server :ServerInterface, side :boolean) {
      this.side = side;
      this.server = server;
    }

    isMyTurn() :boolean {
      return this.side == this.server.getInTern();
    }
    show(callback :FieldShow) {
      return this.server.show(callback);
    }
    showInHand(callback :(q :Rule.Quantum)=>void) {
      return this.server.showInHand(this.side, callback);
    }
    get(at :common.Pos) :Rule.Quantum {
      return this.server.get(at);
    }
    aHandPut(q :Rule.Quantum, to :common.Pos) {
      return this.server.aHandPut(this.side, q, to);
    }
    aHandStep(from :common.Pos, to:common.Pos, listenReface :() => boolean) :boolean {
      return this.server.aHandStep(this.side, from, to, listenReface);
    }
  }
}
