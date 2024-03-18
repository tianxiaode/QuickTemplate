import {IFeatureProvider} from './FeatureProvider'
import {IStringValueType} from './StringValueType'


 export interface IFeature {
	name: string ;
	displayName: string ;
	value: string ;
	provider: IFeatureProvider ;
	description: string ;
	valueType: IStringValueType ;
	depth: number ;
	parentName: string ;
}
 

