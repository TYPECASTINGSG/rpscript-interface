export interface RpsDefaultModel {
    [defaultName:string]:RpsActionModel[];
}
export interface RpsModuleModel {
    name:string;
    npmModuleName:string;
    npmVersion:string;
    actions?: RpsModuleActionsModel;
}
export interface RpsModuleActionsModel { [actionName:string]:RpsActionModel; }

export interface RpsActionModel {
    modName?:string;
    defaultName?:string;
    actionName?:string;
    defaultEnabled?:boolean;
    defaultPriority?:number;
    params?:RpsActionParamModel[];

    description?:string;
}

export interface RpsActionParamModel {
    name:string;
    description?:string;
    defaultPattern?:string|RegExp;
}

// {
//     "$DEFAULT": {
//       "notifier": [
//         {
//           "modName": "notifier",
//           "actionName": "notify",
//           "defaultEnabled": true,
//           "defaultPriority": 3,
//           "description": "desc for notifier action",
//           "params": [
//             {
//               "name": "title",
//               "description": "desc for title param",
//               "defaultPatterns": ".*"
//             },
//             {
//               "name": "message",
//               "description": "desc for message param",
//               "defaultPatterns": "$^"
//             }
//           ]
//         }
//       ]
//     },
//     "notifier": {
//       "name": "notifier",
//       "npmModuleName": "rpscript-api-notifier",
//       "npmVersion":"0.2.1",
//       "actions": {
//         "notify": {
//           "modName": "notifier",
//           "actionName": "notify",
//           "defaultEnabled": true,
//           "defaultPriority": 3,
//           "description": "desc for notifier action",
//           "params": [
//             {
//               "name": "title",
//               "description": "desc for title param",
//               "defaultPatterns": ".*"
//             },
//             {
//               "name": "message",
//               "description": "desc for message param",
//               "defaultPatterns": "$^"
//             }
//           ]
//         }
//       }
//     }
//   }