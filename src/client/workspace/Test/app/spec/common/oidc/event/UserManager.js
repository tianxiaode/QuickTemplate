Ext.define('Test.spec.common.oidc.event.UserManager', {
   
    requires:[
        'Common.oidc.event.UserManager'
    ],

    statics:{
        run(){
            describe("Common.oidc.event.UserManager", () => {

                let subject;
            
                beforeEach(() => {
                    let settings = Ext.create('oidc.setting.usermanager', {
                        authority: "authority",
                        clientId: "client",
                        redirectUri: "redirect",
                    });
                    subject = Ext.create('oidc.event.usermanager', settings.accessTokenExpiringNotificationTimeInSeconds);
                });
            
                describe("silent renew error", () => {
            
                    it("should allow callback", () => {
                        // arrange
                        let cb = jasmine.createSpy();
            
                        // act
                        subject.addSilentRenewError(cb);
                        subject.raiseSilentRenewError(new Error("boom"));
            
                        // assert
                        expect(cb).toHaveBeenCalled();
                    });
            
                    it("should allow unregistering callback", () => {
                        // arrange
                        let cb = jasmine.createSpy();
            
                        // act
                        subject.addSilentRenewError(cb);
                        subject.removeSilentRenewError(cb);
                        subject.raiseSilentRenewError(new Error("boom"));
            
                        // assert
                        expect(cb).toHaveBeenCalledTimes(0);
                    });
            
                    it("should pass error to callback", () => {
                        // arrange
                        let e;
                        let cb = function (arg_e) {
                            e = arg_e;
                        };
                        let expected = new Error("boom");
            
                        // act
                        subject.addSilentRenewError(cb);
                        subject.raiseSilentRenewError(expected);
            
                        // assert
                        expect(e).toEqual(expected);
                    });
                });
            });
            
        }
    }
})