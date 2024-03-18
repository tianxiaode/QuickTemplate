import {IMethodParameterApiDescriptionModel} from './MethodParameterApiDescriptionModel'
import {IParameterApiDescriptionModel} from './ParameterApiDescriptionModel'
import {IReturnValueApiDescriptionModel} from './ReturnValueApiDescriptionModel'


 export interface IActionApiDescriptionModel {
	uniqueName: string ;
	name: string ;
	httpMethod: string ;
	url: string ;
	supportedVersions: any ;
	parametersOnMethod: IMethodParameterApiDescriptionModel ;
	parameters: IParameterApiDescriptionModel ;
	returnValue: IReturnValueApiDescriptionModel ;
	allowAnonymous: boolean ;
	implementFrom: string ;
}
 

