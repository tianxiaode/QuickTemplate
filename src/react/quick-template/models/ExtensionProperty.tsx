import {IExtensionPropertyAttribute} from './ExtensionPropertyAttribute'


 export interface IExtensionProperty {
	type: string ;
	typeSimple: string ;
	displayName: any ;
	api: any ;
	ui: any ;
	attributes: IExtensionPropertyAttribute ;
	configuration: any ;
	defaultValue: any ;
}
 

