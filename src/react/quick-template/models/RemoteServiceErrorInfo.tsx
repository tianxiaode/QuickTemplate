import {IRemoteServiceValidationErrorInfo} from './RemoteServiceValidationErrorInfo'


 export interface IRemoteServiceErrorInfo {
	code: string ;
	message: string ;
	details: string ;
	data: any ;
	validationErrors: IRemoteServiceValidationErrorInfo ;
}
 

