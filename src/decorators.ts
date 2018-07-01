import R from 'ramda';
import { RpsContext } from './context';
import {RpsModuleModel,RpsModuleActionsModel,RpsActionModel,RpsActionParamModel} from './interface';

var getParamNames = require('get-parameter-names');

const ACTION_EVT_NAME = "action";

export function RpsModule (modName:string) : Function {
    return function<T extends {new(...args:any[]):{}}>(constructor:T) {
        Object.defineProperty(constructor,'rpsModuleName',{value:modName});
        return constructor;
    }
}


export function rpsAction (config?:RpsActionModel) : Function{
    return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<Function>) {
        
        const originalMethod = descriptor.value;
        let rpsModule = <RpsModuleModel>target;
        
        descriptor.value = async function(ctx:RpsContext, opts:Object,  ... args: any[]) {
            try{
                ctx.event.emit(ACTION_EVT_NAME, rpsModule.name, key, 'start', args);
            
                const result = await originalMethod.apply(target, R.concat([ctx,opts] , args));

                ctx.event.emit(ACTION_EVT_NAME, rpsModule.name, key, 'end', result);
                
                return result;
                
            }catch(err){
                ctx.event.emit(ACTION_EVT_NAME, rpsModule.name, key, 'error', err);
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
        let rpsModule = <RpsModuleModel>target;

        descriptor.value = async function(ctx:RpsContext, opts:Object,  ... args: any[]) {
            ctx.event.emit(ACTION_EVT_NAME, rpsModule.name, key, 'start', args);
        
            const result = await originalMethod.apply(target, R.concat([ctx,opts] , args));

            ctx.event.emit(ACTION_EVT_NAME, rpsModule.name, key, 'end', result);
            
            return result;
        }
        
        let updatedConfig = updateConfig(originalMethod,config);

        Object.defineProperty(descriptor.value,'rpsActionConfig',{value:updatedConfig});

        return descriptor;
    }

}

function updateConfig (originalMethod:Function,config:RpsActionModel) : RpsActionModel{
    config = config || {};
    if(config.defaultName && config.defaultEnabled == undefined) config.defaultEnabled = true;
    
    config = R.merge({defaultEnabled:false,defaultPriority:3} , config);
    
    let params:RpsActionParamModel[] = config.params || [];

    //extract param name, skip options and $CONTEXT
    let paramNames:string[] = getParamNames(originalMethod).slice(2);

    //actionName is method name
    config.actionName = originalMethod.name;

    //update all params url pattern
    params = R.map( pName => {
        let p:RpsActionParamModel = R.find(R.propEq('name', pName))(params);
        if (!p) p = {name:pName};

        if(!p.defaultPattern) p.defaultPattern = /$^/.source;
        else if(p.defaultPattern instanceof RegExp) p.defaultPattern  = p.defaultPattern.source;

        return p;
    }, paramNames);

    config.params = params;

    return config;
}