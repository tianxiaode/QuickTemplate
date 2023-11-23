Ext.define('Test.spec.common.oidc.request.Signout', {
   
    requires:[
        'Common.oidc.request.Signout'
    ],

    statics:{
        run(){
            describe("Common.oidc.request.Signout", () => {

                let subject;
                let settings;
            
                beforeEach(() => {
                    settings = {
                        url: "http://sts/signout",
                        idTokenHint: "hint",
                        postLogoutRedirectUri: "loggedout",
                        stateData: { data: "test" },
                    };
                    subject = Ext.create('oidc.request.signout', settings);
                });
            
                describe("constructor", () => {
            
                    it("should require a url param", () => {
                        // arrange
                        Object.assign(settings, { url: undefined });
            
                        // act
                        try {
                            Ext.create('oidc.request.signout', settings);
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect((err).message).toContain("url");
                        }
                    });
                });
            
                describe("url", () => {
            
                    it("should include url", () => {
                        // assert
                        expect(subject.url.indexOf("http://sts/signout")).toEqual(0);
                    });
            
                    it("should include id_token_hint", () => {
                        // assert
                        expect(subject.url).toContain("id_token_hint=hint");
                    });
            
                    it("should include post_logout_redirect_uri if id_token_hint also provided", () => {
                        // assert
                        expect(subject.url).toContain("post_logout_redirect_uri=loggedout");
                    });
            
                    it("should include post_logout_redirect_uri if no id_token_hint provided", () => {
                        // arrange
                        delete settings.idTokenHint;
            
                        // act
                        subject = Ext.create('oidc.request.signout', settings);
            
                        // assert
                        expect(subject.url).toContain("post_logout_redirect_uri=loggedout");
                    });
            
                    it("should include state if post_logout_redirect_uri provided", () => {
                        // assert
                        expect(subject.state).toBeDefined();
                        expect(subject.url).toContain("state=" + subject.state.id);
                    });
            
                    it("should not include state if no post_logout_redirect_uri provided", () => {
                        // arrange
                        delete settings.postLogoutRedirectUri;
            
                        // act
                        subject = Ext.create('oidc.request.signout', settings);
            
                        // assert
                        expect(subject.url).not.toContain("state=");
                    });
            
                    it("should include id_token_hint, post_logout_redirect_uri, and state", () => {
                        // assert
                        const url = subject.url;
                        expect(url.indexOf("http://sts/signout?")).toEqual(0);
                        expect(url).toContain("id_token_hint=hint");
                        expect(url).toContain("post_logout_redirect_uri=loggedout");
                        expect(subject.state).toBeDefined();
                        expect(url).toContain("state=" + subject.state.id);
                    });
            
                    it("should include extra query params", () => {
                        // arrange
                        settings.extraQueryParams = {
                            "TargetResource": "logouturl.com",
                            "InErrorResource": "errorurl.com",
                        };
            
                        // act
                        subject = Ext.create('oidc.request.signout', settings);
            
                        // assert
                        expect(subject.url).toContain("TargetResource=logouturl.com&InErrorResource=errorurl.com");
                    });
            
                });
            });
                       
        }
    }

});