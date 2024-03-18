import {IMenu} from './Menu'
import {IMenu} from './Menu'
import {IMenuTranslation} from './MenuTranslation'


 export interface IMenu {
	readonly extraProperties: any ;
	id: string ;
	creationTime: string ;
	creatorId: string ;
	lastModificationTime: string ;
	lastModifierId: string ;
	code: string ;
	displayName: string ;
	parentId: string ;
	leaf: boolean ;
	parent: IMenu ;
	children: IMenu ;
	icon: string ;
	isSelectable: boolean ;
	isDisabled: boolean ;
	order: number ;
	router: string ;
	groupName: string ;
	concurrencyStamp: string ;
	translations: IMenuTranslation ;
	permissions: any ;
}
 

