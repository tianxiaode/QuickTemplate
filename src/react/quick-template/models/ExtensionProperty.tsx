import {ILocalizableString} from './LocalizableString'
import {IExtensionPropertyApi} from './ExtensionPropertyApi'
import {IExtensionPropertyUi} from './ExtensionPropertyUi'
import {IExtensionPropertyAttribute} from './ExtensionPropertyAttribute'


 export interface IExtensionProperty {
	type: string ;
	typeSimple: string ;
	displayName: ILocalizableString ;
	api: IExtensionPropertyApi ;
	ui: IExtensionPropertyUi ;
	attributes: IExtensionPropertyAttribute ;
	configuration: any ;
	defaultValue: any ;
}
 

