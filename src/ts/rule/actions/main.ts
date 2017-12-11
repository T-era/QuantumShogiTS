/// <reference path='move.ts'/>
/// <reference path='putOn.ts'/>
/// <reference path='reface.ts'/>

module Rule {
  export module QuantumAction {
    export interface Action<T> {
      prepare(arg :T) :ActionCont;
    }
    export interface ActionCont {
      can() :boolean
      do() :void
    }
    class _FalseCont implements ActionCont {
      can() { return false; }
      do() { throw "Illegal call" }
    }
    export var FalseCont :ActionCont = new _FalseCont();
  }
}
