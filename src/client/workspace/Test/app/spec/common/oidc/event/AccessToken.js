Ext.define('Test.spec.common.oidc.event.AccessToken', {
   
    requires:[
        'Common.oidc.event.AccessToken'
    ],

    statics:{
        run(){
            describe("AccessTokenEvents", () => {

                let subject;
                let expiringTimer;
                let expiredTimer;
            
                beforeEach(() => {
                    expiringTimer = Ext.create('oidc.stubtimer', "stub expiring timer");
                    expiredTimer = Ext.create('oidc.stubtimer', "stub expired timer");
            
                    subject = Ext.create('oidc.event.accesstoken',  60);
            
                    // access private members
                    Object.assign(subject, {
                        expiringTimer: expiringTimer,
                        expiredTimer: expiredTimer,
                    });
                });
            
                describe("constructor", () => {
            
                    it("should use default expiringNotificationTime", () => {
                        expect(subject["expiringNotificationTimeInSeconds"]).toEqual(60);
                    });
            
                });
            
                describe("load", () => {
            
                    it("should cancel existing timers", () => {
                        // act
                        subject.load({});
            
                        // assert
                        expect(expiringTimer.cancelWasCalled).toEqual(true);
                        expect(expiredTimer.cancelWasCalled).toEqual(true);
                    });
            
                    it("should initialize timers", () => {
                        // act
                        subject.load({
                            accessToken:"token",
                            expiresIn : 70,
                        });
            
                        // assert
                        expect(expiringTimer.duration).toEqual(10);
                        expect(expiredTimer.duration).toEqual(71);
                    });
            
                    it("should immediately schedule expiring timer if expiration is soon", () => {
                        // act
                        subject.load({
                            accessToken:"token",
                            expiresIn : 10,
                        });
            
                        // assert
                        expect(expiringTimer.duration).toEqual(1);
                    });
            
                    it("should not initialize expiring timer if already expired", () => {
                        // act
                        subject.load({
                            accessToken:"token",
                            expiresIn : 0,
                        });
            
                        // assert
                        expect(expiringTimer.duration).toEqual(undefined);
                    });
            
                    it("should initialize expired timer if already expired", () => {
                        // act
                        subject.load({
                            accessToken:"token",
                            expiresIn : 0,
                        });
            
                        // assert
                        expect(expiredTimer.duration).toEqual(1);
                    });
            
                    it("should not initialize timers if no access token", () => {
                        // act
                        subject.load({
                            expiresIn : 70
                        });
            
                        // assert
                        expect(expiringTimer.duration).toEqual(undefined);
                        expect(expiredTimer.duration).toEqual(undefined);
                    });
            
                    it("should not initialize timers if no expiration on access token", () => {
                        // act
                        subject.load({
                            access_token:"token",
                        });
            
                        // assert
                        expect(expiringTimer.duration).toEqual(undefined);
                        expect(expiredTimer.duration).toEqual(undefined);
                    });
                });
            
                describe("unload", () => {
            
                    it("should cancel timers", () => {
                        // act
                        subject.unload();
            
                        // assert
                        expect(expiringTimer.cancelWasCalled).toEqual(true);
                        expect(expiredTimer.cancelWasCalled).toEqual(true);
                    });
                });
            });
             
        }
    }

});