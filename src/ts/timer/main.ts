module Timer {
  export type TimeoutCallback = (side :boolean, result :boolean)=>void
  export interface Timer {
    addCallback(callback :TimeoutCallback);
    start();
    switchOff();
    switchOn();
    showRemains() :string[]
  }
  /// loadTime :min.
  export function newTimer(minTime :number, loadTime :number) :Timer {
    return new TimerImpl(minTime, loadTime);
  }
  class SideTimer {
    side :boolean;
    minTime :number;
    restSec :number;
    noRest :boolean;
    workOn :Date;
    callbackList :TimeoutCallback[];

    constructor(side :boolean, minTime :number, loadTimeSec :number) {
      this.side = side;
      this.minTime = minTime;
      this.restSec = loadTimeSec;
      this.workOn = null;
      this.noRest = false;
      this.callbackList = [];
    }

    _durationSec() {
      var duration = new Date().getTime() - this.workOn.getTime();
      return Math.floor(duration / 1000);
    }
    switchOff() {
      var durationSec = this._durationSec();
      this.workOn = null;
      if (this.noRest) {
        if (this.minTime < durationSec) {
          this.callbackList.forEach(function(callback) {
            callback(this.side, true);
          }.bind(this));
        }
      } else {
        this.restSec -= durationSec;
        if (this.restSec < 0) {
          this.callbackList.forEach(function(callback) {
            callback(this.side, true);
          }.bind(this));
          return;
        } else if (this.restSec <= this.minTime) {
          this.callbackList.forEach(function(callback) {
            callback(this.side, false);
          }.bind(this));
          this.noRest = true;
        }
      }
    }
    switchOn() {
      this.workOn = new Date();
    }
    toString() :string {
      if (this.noRest) {
        if (this.workOn) {
          var durationSec = this._durationSec();
          return String(this.minTime - durationSec);
        } else {
          return "-";
        }
      } else {
        if (this.workOn) {
          var durationSec = this._durationSec();
          return String(this.restSec - durationSec);
        } else {
          return String(this.restSec);
        }
      }
    }
  }
  class TimerImpl {
    winner :boolean;
    sideOn :boolean;
    timerT :SideTimer;
    timerF :SideTimer;

    constructor(minTime :number, loadTime :number) {
      var loadTimeSec = loadTime * 60;
      this.timerT = new SideTimer(true, minTime, loadTimeSec);
      this.timerF = new SideTimer(false, minTime, loadTimeSec);
      var listenFinished = this._listenFinished.bind(this);
      this.timerT.callbackList.push(listenFinished);
      this.timerF.callbackList.push(listenFinished);
      this.sideOn = null;
      this.winner = null;
    }

    _listenFinished(side :boolean, result :boolean) {
      if (result) {
        this.sideOn = null;
        this.winner = ! side;
      }
    }

    addCallback(callback :TimeoutCallback) {
      this.timerT.callbackList.push(callback);
      this.timerF.callbackList.push(callback);
    }

    start() {
      this.sideOn = true;
      this.timerT.switchOn();
    }

    switchOff() {
      if (this.sideOn === true) {
        this.sideOn = false;
        this.timerT.switchOff();
      } else if (this.sideOn === false) {
        this.sideOn = true;
        this.timerF.switchOff();
      } else {
        // 'Not running';
      }
    }
    switchOn() {
      if (this.sideOn === true) {
        this.timerT.switchOn();
      } else if (this.sideOn === false) {
        this.timerF.switchOn();
      } else {
        // 'Not running';
      }
    }

    showRemains() {
      if (this.sideOn === null) {
        if (this.winner) {
          return ["O", "x"];
        } else {
          return ["x", "O"];
        }
      } else {
        return [
          this.timerT.toString(),
          this.timerF.toString()
        ]
      }
    }
  }
}
