import { EventEmitter } from 'events';
import ConfigStore from 'configstore';
import {RpsDefaultModel,RpsActionModel} from './interface';
import R from 'ramda';

export class RpsContext {

  readonly _runtimeconfig:string = 'rpscript-runtime';
  readonly _config:string = 'rpscript';

  configStore:ConfigStore;

  private _result:any;

  get $RESULT():any{ return this._result; }
  set $RESULT(result:any){ this._result = result; }

  event:EventEmitter;

  variables:Object;

  constructor(){
    this.event = new EventEmitter();
    this.variables = {};
    this.$RESULT = "";

    this.configStore = new ConfigStore(this._runtimeconfig);
    this.configStore.clear();

    this.configStore.set(new ConfigStore(this._config).all);
  }

  getRuntimeDefault() : RpsDefaultModel {
    return this.configStore.get('$DEFAULT');
  }
  saveRuntimeDefault(rpsDefault:RpsDefaultModel) : void {
    this.configStore.set('$DEFAULT',rpsDefault);
  }

  updatePriority(moduleName:string, keyword:string, level:number) : void {
    let defaultModel:RpsDefaultModel = this.getRuntimeDefault();
    let actions:RpsActionModel[] = defaultModel[keyword];
    
    let action:RpsActionModel = R.find(R.propEq('moduleName',moduleName) , actions);
    action.priority = level;

    this.saveRuntimeDefault(defaultModel);
  }

}
