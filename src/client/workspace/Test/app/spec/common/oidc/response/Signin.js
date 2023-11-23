Ext.define('Test.spec.common.oidc.response.Signin', {

    requires:[
        'Common.oidc.response.Signin'
    ],

    statics:{
        run(){
            describe("Common.oidc.response.Signin", () => {
                let now;
            
                beforeEach(() => {
                    now = 0;
                    spyOn(Oidc.Timer, "getEpochTime").and.callFake(() => now);
                });
            
                describe("letructor", () => {
                    it("should read error", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin', new URLSearchParams("error=foo"));
            
                        // assert
                        expect(subject.error).toEqual("foo");
                    });
            
                    it("should read error_description", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams("error_description=foo"));
            
                        // assert
                        expect(subject.errorDescription).toEqual("foo");
                    });
            
                    it("should read error_uri", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin', new URLSearchParams("error_uri=foo"));
            
                        // assert
                        expect(subject.errorUri).toEqual("foo");
                    });
            
                    it("should read state", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams("state=foo"));
            
                        // assert
                        expect(subject.state).toEqual("foo");
                    });
            
                    it("should read url_state", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams("state=foo;bar"));
            
                        // assert
                        expect(subject.state).toEqual("foo");
                        expect(subject.urlState).toEqual("bar");
                    });
            
                    it("should return url_state that uses the delimiter unmodified", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams("state=foo;bar;baz"));
            
                        // assert
                        expect(subject.state).toEqual("foo");
                        expect(subject.urlState).toEqual("bar;baz");
                    });
            
                    it("should read code", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams("code=foo"));
            
                        // assert
                        expect(subject.code).toEqual("foo");
                    });
            
                    it("should read session_state", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams("session_state=foo"));
            
                        // assert
                        expect(subject.sessionState).toEqual("foo");
                    });
            
                    it("should calculate expires_at", () => {
                        // act
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams());
                        subject.setExpiresIn(10);
                        //Object.assign(subject, { expiresIn:10 });
            
                        // assert
                        expect(subject.expiresAt).toEqual(Oidc.Timer.getEpochTime() + 10);
                    });

                    ["foo",-10].forEach((expiresIn)=>{
                        it(`should not read invalid expires_in:${expiresIn} `, ()=>{
                            let subject = Ext.create('oidc.response.signin',new URLSearchParams());
                            subject.setExpiresIn(expiresIn);
                            //Object.assign(subject, { expiresIn });
                
                            // assert
                            expect(subject.getExpiresIn()).toBeUndefined();
                            expect(subject.expiresAt).toBeUndefined();
    
                        })

                    })            
                });
            
                describe("expires_in", () => {
                    it("should calculate how much time left", () => {
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams());
                        subject.setExpiresIn(100);
                        //Object.assign(subject, { expiresIn: 100 });
            
                        // act
                        now += 50;
            
                        // assert
                        expect(subject.getExpiresIn()).toEqual(50);
                    });
                });
            
                describe("isOpenId", () => {
                    it("should detect openid scope", () => {
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams());
            
                        // act
                        Object.assign(subject, { scope: "foo openid bar" });
            
                        // assert
                        expect(subject.isOpenId()).toEqual(true);
            
                        // act
                        Object.assign(subject, { scope: "openid foo bar" });
            
                        // assert
                        expect(subject.isOpenId()).toEqual(true);
            
                        // act
                        Object.assign(subject, { scope: "foo bar openid" });
            
                        // assert
                        expect(subject.isOpenId()).toEqual(true);
            
                        // act
                        Object.assign(subject, { scope: "foo bar" });
            
                        // assert
                        expect(subject.isOpenId()).toEqual(false);
                    });
            
                    it("shoud detect id_token", () => {
                        let subject = Ext.create('oidc.response.signin',new URLSearchParams());
            
                        // act
                        Object.assign(subject, { idToken: undefined });
            
                        // assert
                        expect(subject.isOpenId()).toEqual(false);
            
                        // act
                        Object.assign(subject, { idToken: "id_token" });
            
                        // assert
                        expect(subject.isOpenId()).toEqual(true);
                    });
                });
            });
            
        }
    }
   
});