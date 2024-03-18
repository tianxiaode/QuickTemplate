import {IExtensionPropertyApiGet} from './ExtensionPropertyApiGet'
import {IExtensionPropertyApiCreate} from './ExtensionPropertyApiCreate'
import {IExtensionPropertyApiUpdate} from './ExtensionPropertyApiUpdate'


 export interface IExtensionPropertyApi {
	onGet: IExtensionPropertyApiGet ;
	onCreate: IExtensionPropertyApiCreate ;
	onUpdate: IExtensionPropertyApiUpdate ;
}
 

