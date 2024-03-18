import {IRoleTranslation} from './RoleTranslation'


 export interface IRole {
	readonly extraProperties: any ;
	id: string ;
	name: string ;
	isDefault: boolean ;
	isStatic: boolean ;
	isPublic: boolean ;
	concurrencyStamp: string ;
	permissions: any ;
	translations: IRoleTranslation ;
}
 

