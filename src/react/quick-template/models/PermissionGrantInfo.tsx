import {IProviderInfo} from './ProviderInfo'


 export interface IPermissionGrantInfo {
	name: string ;
	displayName: string ;
	parentName: string ;
	isGranted: boolean ;
	allowedProviders: any ;
	grantedProviders: IProviderInfo ;
}
 

