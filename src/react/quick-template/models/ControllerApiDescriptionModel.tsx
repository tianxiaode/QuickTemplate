import {IControllerInterfaceApiDescriptionModel} from './ControllernterfaceApiDescriptionModel'


 export interface IControllerApiDescriptionModel {
	controllerName: string ;
	controllerGroupName: string ;
	isRemoteService: boolean ;
	isIntegrationService: boolean ;
	apiVersion: string ;
	type: string ;
	interfaces: IControllerInterfaceApiDescriptionModel ;
	actions: any ;
}
 

