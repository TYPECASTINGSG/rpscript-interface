export interface RpsDefaultModel {
    [verbName:string]:RpsActionModel[];
}
export interface RpsModuleModel {
    name:string;
    npmModuleName:string;
    npmVersion:string;
    enabled:boolean;
    actions?: RpsModuleActionsModel;
    description?:string;
    tags?:string[];
}
export interface RpsModuleActionsModel { [verbName:string]:RpsActionModel; }

export interface RpsActionModel {
    moduleName?:string;
    verbName?:string;
    methodName?:string;
    enabled?:boolean;
    priority?:number;
    params?:RpsActionParamModel[];

    description?:string;
    tags?:string[];
}

export interface RpsActionParamModel {
    name:string;
    description?:string;
    pattern?:string|RegExp;
}
