import {IPropertyApiDescriptionModel} from './PropertyApiDescriptionModel'


 export interface ITypeApiDescriptionModel {
	baseType: string ;
	isEnum: boolean ;
	enumNames: any ;
	enumValues: any ;
	genericArguments: any ;
	properties: IPropertyApiDescriptionModel ;
}
 

