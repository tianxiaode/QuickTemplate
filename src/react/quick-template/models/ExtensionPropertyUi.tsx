import {IExtensionPropertyUiTable} from './ExtensionPropertyUiTable'
import {IExtensionPropertyUiForm} from './ExtensionPropertyUiForm'
import {IExtensionPropertyUiForm} from './ExtensionPropertyUiForm'
import {IExtensionPropertyUiLookup} from './ExtensionPropertyUiLookup'


 export interface IExtensionPropertyUi {
	onTable: IExtensionPropertyUiTable ;
	onCreateForm: IExtensionPropertyUiForm ;
	onEditForm: IExtensionPropertyUiForm ;
	lookup: IExtensionPropertyUiLookup ;
}
 

