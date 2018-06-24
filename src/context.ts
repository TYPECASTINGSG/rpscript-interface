import { EventEmitter } from 'events';

export class RpsContext {

  private _result:any;

  get $RESULT():any{ return this._result; }
  set $RESULT(result:any){ this._result = result; }

  event:EventEmitter;

  variables:Object;

  constructor(){
    this.event = new EventEmitter();
    this.variables = {};
    this.$RESULT = "";
  }
}
