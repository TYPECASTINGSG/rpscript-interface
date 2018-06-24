import R from 'ramda';
import { RpsContext } from './context';
import {RpsModuleInt,ActionConfig} from './interface';

const ACTION_EVT_NAME = "action";

export function RpsModule (modName:string) : Function {
    return function<T extends {new(...args:any[]):{}}>(constructor:T) {
        Object.defineProperty(constructor,'rpsModuleName',{value:modName});
        return constructor;
    }
}


export function rpsAction (config?:ActionConfig) : Function{
    return function(target: Object, key: string, descriptor: TypedPropertyDescriptor<Function>) {

        const originalMethod = descriptor.value;
        let rpsModule = <RpsModuleInt>target;
        config.actionName = originalMethod.name;

        descriptor.value = async function(ctx:RpsContext, opts:Object,  ... args: any[]) {
            try{
                ctx.event.emit(ACTION_EVT_NAME, rpsModule.moduleName, key, 'start', args);
                
                const result = await originalMethod.apply(target, R.concat([ctx,opts] , args));

                ctx.event.emit(ACTION_EVT_NAME, rpsModule.moduleName, key, 'end', result);
                
                return result;
            }catch(err){
                ctx.event.emit(ACTION_EVT_NAME, rpsModule.moduleName, key, 'error', err);
                return err;
            }
        }

        Object.defineProperty(descriptor.value,'rpsActionConfig',{value:config});

        return descriptor;
    }
}
