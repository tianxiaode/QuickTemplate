import {IMethodParameterApiDescriptionModel} from './MethodParameterApiDescriptionModel'
import {IParameterApiDescriptionModel} from './ParameterApiDescriptionModel'


 export interface IActionApiDescriptionModel {
	uniqueName: string ;
	name: string ;
	httpMethod: string ;
	url: string ;
	supportedVersions: any ;
	parametersOnMethod: IMethodParameterApiDescriptionModel ;
	parameters: IParameterApiDescriptionModel ;
	returnValue: any ;
	allowAnonymous: boolean ;
	implementFrom: string ;
}
 

