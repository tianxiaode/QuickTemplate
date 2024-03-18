import {IApplicationLocalizationConfiguration} from './ApplicationLocalizationConfiguration'
import {IApplicationAuthConfiguration} from './ApplicationAuthConfiguration'
import {IApplicationSettingConfiguration} from './ApplicationSettingConfiguration'
import {ICurrentUser} from './CurrentUser'
import {IApplicationFeatureConfiguration} from './ApplicationFeatureConfiguration'
import {IApplicationGlobalFeatureConfiguration} from './ApplicationGlobalFeatureConfiguration'
import {IMultiTenancyInfo} from './MultiTenancyInfo'
import {ICurrentTenant} from './CurrentTenant'
import {ITiming} from './Timing'
import {IClock} from './Clock'
import {IObjectExtensions} from './ObjectExtensions'


 export interface IApplicationConfiguration {
	localization: IApplicationLocalizationConfiguration ;
	auth: IApplicationAuthConfiguration ;
	setting: IApplicationSettingConfiguration ;
	currentUser: ICurrentUser ;
	features: IApplicationFeatureConfiguration ;
	globalFeatures: IApplicationGlobalFeatureConfiguration ;
	multiTenancy: IMultiTenancyInfo ;
	currentTenant: ICurrentTenant ;
	timing: ITiming ;
	clock: IClock ;
	objectExtensions: IObjectExtensions ;
	extraProperties: any ;
}
 

