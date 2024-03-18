import {IDistrictTranslation} from './DistrictTranslation'
import {IDistrict} from './District'


 export interface IDistrict {
	readonly extraProperties: any ;
	id: string ;
	creationTime: string ;
	creatorId: string ;
	lastModificationTime: string ;
	lastModifierId: string ;
	code: string ;
	postcode: string ;
	displayName: string ;
	parentId: string ;
	leaf: boolean ;
	parent: any ;
	translations: IDistrictTranslation ;
	children: IDistrict ;
}
 

