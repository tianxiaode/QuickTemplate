import {IMethodParameterApiDescriptionModel} from './MethodParameterApiDescriptionModel'
import {IReturnValueApiDescriptionModel} from './ReturnValueApiDescriptionModel'


 export interface IInterfaceMethodApiDescriptionModel {
	name: string ;
	parametersOnMethod: IMethodParameterApiDescriptionModel ;
	returnValue: IReturnValueApiDescriptionModel ;
}
 

