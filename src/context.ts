import { EventEmitter } from 'events';
import ConfigStore from 'configstore';
import {RpsDefaultModel,RpsActionModel} from './interface';
import * as R from 'ramda';

export class RpsContext {

  readonly _runtimeconfig:string = 'rpscript-runtime';
  readonly _config:string = 'rpscript';

  static readonly LOAD_MOD_ERR_EVT:string = 'action.module.load.error';

  configStore:any;
  private _moduleContext:Object;
  private _result:any;

  get $RESULT():any{ return this._result; }
  set $RESULT(result:any){ this._result = result; }

  event:EventEmitter;

  variables:Object;

  constructor(){
    this.event = new EventEmitter();
    this.variables = {};
    this.$RESULT = "";
    this._moduleContext = Object;

    this.configStore = new ConfigStore(this._runtimeconfig);
    this.configStore.clear();

    this.configStore.set(new ConfigStore(this._config).all);
  }

  addModuleContext (modName:string,context:any) : void{
    this._moduleContext[modName] = context;
  }
  getModuleContext (modName:string) : any{
    return this._moduleContext[modName];
  }

  getAllContexts () :any[]{
    return R.values(this._moduleContext);
  }
  getModuleContextStartWith(startingName:string) : any[] {
    let list = [];
    
    R.keys(this._moduleContext).forEach( key => {

      if(key.startsWith(startingName)) list.push( this._moduleContext[key] );
      
    });

    return list;
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

    this.event.emit('context.priority.set',moduleName,keyword,level);
  }

}
