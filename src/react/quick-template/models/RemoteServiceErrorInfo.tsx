import {IRemoteServiceValidationErrorInfo} from './RemoteServiceValidationErrornfo'


 export interface IRemoteServiceErrorInfo {
	code: string ;
	message: string ;
	details: string ;
	data: any ;
	validationErrors: IRemoteServiceValidationErrorInfo ;
}
 

