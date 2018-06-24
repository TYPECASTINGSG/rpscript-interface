export abstract class RpsModuleInt {
    moduleName:string;
}

export interface RpsModule {
    importPath:string;
    actions?:ActionObj;
}
export interface ActionObj {
    [name:string] : ActionConfig;
}
export interface ActionConfig {
    actionName?:string;
    defaultName?:string;
    defaultParamPatterns?:ActionDefaultParamPattern;
}
export interface ActionDefaultParamPattern {
    [paramName:string]:RegExp;
}
