

 export interface IIdentityUser {
	readonly extraProperties: any ;
	id: string ;
	creationTime: string ;
	creatorId: string ;
	lastModificationTime: string ;
	lastModifierId: string ;
	isDeleted: boolean ;
	deleterId: string ;
	deletionTime: string ;
	tenantId: string ;
	userName: string ;
	name: string ;
	surname: string ;
	email: string ;
	emailConfirmed: boolean ;
	phoneNumber: string ;
	phoneNumberConfirmed: boolean ;
	isActive: boolean ;
	lockoutEnabled: boolean ;
	accessFailedCount: number ;
	lockoutEnd: string ;
	concurrencyStamp: string ;
	entityVersion: number ;
	lastPasswordChangeTime: string ;
}
 

