Ext.define('Test.spec.common.oidc.state.Signin', {
    requires: [
        'Common.oidc.state.Signin'
    ],

    statics: {
        run() {
            describe("Common.oidc.state.Signin", () => {
                describe("letructor", () => {
            
                    it("should call base ctor", async () => {
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            id: "5",
                            created: 6,
                            data: 7,
            
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://cb",
                            requestType: "type",
                            scope: "scope",
                            urlState: "foo",
                        });
            
                        // assert
                        expect(subject.id).toEqual("5");
                        expect(subject.created).toEqual(6);
                        expect(subject.data).toEqual(7);
                        expect(subject.urlState).toEqual("foo");
                    });
            
                    it("should accept redirectUri", async () => {
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            authority: "authority",
                            clientId: "client",
                            scope: "scope",
                            requestType: "type",
                            redirectUri: "http://cb",
                        });
            
                        // assert
                        expect(subject.redirectUri).toEqual("http://cb");
                    });
            
                    it("should accept codeVerifier", async () => {
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://cb",
                            scope: "scope",
                            requestType: "type",
                            codeVerifier: "5",
                        });
            
                        // assert
                        expect(subject.codeVerifier).toEqual("5");
                    });
            
                    it("should generate codeVerifier", async () => {
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://cb",
                            scope: "scope",
                            requestType: "type",
                            codeVerifier: true,
                        });
            
                        // assert
                        expect(subject.codeVerifier).toBeDefined();
                    });
            
                    it("should generate codeChallenge", async () => {
                        // arrange
            
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://cb",
                            scope: "scope",
                            requestType: "type",
                            codeVerifier: true,
                        });
            
                        // assert
                        expect(subject.codeChallenge).toBeDefined();
                    });
            
                    it("should accept clientId", async () => {
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            authority: "authority",
                            redirectUri: "http://cb",
                            scope: "scope",
                            requestType: "type",
                            clientId: "client",
                        });
            
                        // assert
                        expect(subject.clientId).toEqual("client");
                    });
            
                    it("should accept authority", async () => {
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            clientId: "client",
                            redirectUri: "http://cb",
                            scope: "scope",
                            requestType: "type",
                            authority: "test",
                        });
            
                        // assert
                        expect(subject.authority).toEqual("test");
                    });
            
                    it("should accept requestType", async () => {
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://cb",
                            scope: "scope",
                            requestType: "xoxo",
                        });
            
                        // assert
                        expect(subject.requestType).toEqual("xoxo");
                    });
            
                    it("should accept extraTokenParams", async () => {
                        // act
                        let subject = await Common.oidc.state.Signin.create({
                            authority: "authority",
                            clientId: "client",
                            redirectUri: "http://cb",
                            scope: "scope",
                            requestType: "type",
                            extraTokenParams: {
                                "resourceServer" : "abc",
                            },
                        });
            
                        // assert
                        expect(subject.extraTokenParams).toEqual({ "resourceServer" : "abc" });
                    });
                });
            
                it("can serialize and then deserialize", async () => {
                    // arrange
                    let args = {
                        data: { foo: "test" },
                        created: 1000,
                        codeVerifier: true,
                        authority: "authority",
                        clientId: "client",
                        redirectUri: "http://cb",
                        scope: "scope",
                        requestType: "type",
                    };
                    let subject1 = await Common.oidc.state.Signin.create(args);
            
                    // act
                    let storage = subject1.toStorageString();
                    let subject2 = await Common.oidc.state.Signin.fromStorageString(storage);
                    let result = { codeVerifier: true };

                    Object.keys(args).forEach(k=>{
                        if(k === 'codeVerifier') return;
                        result[k] = subject2[k];
                    });

                    // assert
                    expect(result).toEqual(args);
                });
            });
            
        }
    }
});