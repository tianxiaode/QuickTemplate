

 export interface ICurrentUser {
	isAuthenticated: boolean ;
	id: string ;
	tenantId: string ;
	impersonatorUserId: string ;
	impersonatorTenantId: string ;
	impersonatorUserName: string ;
	impersonatorTenantName: string ;
	userName: string ;
	name: string ;
	surName: string ;
	email: string ;
	emailVerified: boolean ;
	phoneNumber: string ;
	phoneNumberVerified: boolean ;
	roles: any ;
}
 

