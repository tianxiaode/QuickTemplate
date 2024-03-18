import {IValueValidator} from './ValueValidator'


 export interface IStringValueType {
	readonly name: string ;
	readonly properties: any ;
	validator: IValueValidator ;
}
 

