import {IIanaTimeZone} from './IanaTimeZone'
import {IWindowsTimeZone} from './WindowsTimeZone'


 export interface ITimeZone {
	iana: IIanaTimeZone ;
	windows: IWindowsTimeZone ;
}
 

