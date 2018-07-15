import * as R from 'ramda';
import { RpsContext } from './context';
import {RpsModuleModel,RpsModuleActionsModel,RpsActionModel,RpsActionParamModel} from './interface';

var getParamNames = require('get-parameter-names');

const ACTION_EVT_NAME = "action";

export function RpsModule (moduleName:string) : Function {
    return function<T extends {new(...args:any[]):{}}>(constructor:T) {
        Object.defineProperty(constructor,'rpsModuleName',{value:moduleName});
        return constructor;
    }
}


export function rpsAction (config?:RpsActionModel) : Function{
    return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<Function>) {
        
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(ctx:RpsContext, opts:Object,  ... args: any[]) {
            let moduleName = this.constructor['rpsModuleName'];
            try{
                ctx.event.emit(ACTION_EVT_NAME, moduleName, key, 'start', args);
            
                const result = await originalMethod.apply(target, R.concat([ctx,opts] , args));

                ctx.event.emit(ACTION_EVT_NAME, moduleName, key, 'end', result);
                
                return result;
                
            }catch(err){
                ctx.event.emit(ACTION_EVT_NAME, moduleName, key, 'error', err);
                return err;
            }
        }
        
        let updatedConfig = updateConfig(originalMethod,config);

        Object.defineProperty(descriptor.value,'rpsActionConfig',{value:updatedConfig});

        return descriptor;
    }

}


export function rpsActionSkipErrHandling (config?:RpsActionModel) : Function{
    return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<Function>) {
        
        const originalMethod = descriptor.value;

        descriptor.value = async function(ctx:RpsContext, opts:Object,  ... args: any[]) {
            let moduleName = this.constructor['rpsModuleName'];

            ctx.event.emit(ACTION_EVT_NAME, moduleName, key, 'start', args);
        
            const result = await originalMethod.apply(target, R.concat([ctx,opts] , args));

            ctx.event.emit(ACTION_EVT_NAME, moduleName, key, 'end', result);
            
            return result;
        }
        
        let updatedConfig = updateConfig(originalMethod,config);

        Object.defineProperty(descriptor.value,'rpsActionConfig',{value:updatedConfig});

        return descriptor;
    }

}

function updateConfig (originalMethod:Function,config:RpsActionModel) : RpsActionModel{
    config = config || {};
    if(config.verbName && config.enabled == undefined) config.enabled = true;
    
    config = R.merge({enabled:false,priority:3} , config);
    
    let params:RpsActionParamModel[] = config.params || [];

    //extract param name, skip options and $CONTEXT
    let paramNames:string[] = getParamNames(originalMethod).slice(2);

    config.methodName = originalMethod.name;

    //update all params url pattern
    params = R.map( pName => {
        let p:RpsActionParamModel = R.find(R.propEq('name', pName))(params);
        if (!p) p = {name:pName};

        if(!p.pattern) p.pattern = /$^/.source;
        else if(p.pattern instanceof RegExp) p.pattern  = p.pattern.source;

        return p;
    }, paramNames);

    config.params = params;

    return config;
}