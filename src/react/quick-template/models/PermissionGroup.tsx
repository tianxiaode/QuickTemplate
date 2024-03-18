import {IPermissionGrantInfo} from './PermissionGrantInfo'


 export interface IPermissionGroup {
	name: string ;
	displayName: string ;
	displayNameKey: string ;
	displayNameResource: string ;
	permissions: IPermissionGrantInfo ;
}
 

