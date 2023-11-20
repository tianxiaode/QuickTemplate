Ext.define('Test.spec.common.oidc.UserInfoService', {

    requires: [
        'Common.oidc.UserInfoService'
    ],

    statics: {

        run(){
            describe("Common.oidc.UserInfoService", () => {
                let subject;
                let metadataService;
                let jsonService;

                beforeEach(() => {
                    let settings = Ext.create('oidc.clientsettingsstore', {
                        authority: "authority",
                        clientId: "client",
                        redirectUri: "redirect",
                        fetchRequestCredentials: "include",
                    });
                    metadataService = Ext.create('oidc.metadataservice', { settings });

                    subject = Ext.create('oidc.userinfoservice', { settings, metadataService });

                    // access private members
                    jsonService = subject["jsonService"];
                });

                describe("getClaims", () => {

                    it("should return a promise", async () => {
                        // act
                        let p = subject.getClaims("");

                        // assert
                        await expectAsync(p).toBeRejected();
                    });

                    it("should require a token", async () => {
                        // act
                        try {
                            await subject.getClaims("");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toContain("token");
                        }
                    });

                    it("should call userinfo endpoint and pass token", async () => {
                        // arrange
                        spyOn(metadataService, "getUserInfoEndpoint").and.returnValue(Promise.resolve("http://sts/userinfo"));
                        let getJsonMock = spyOn(jsonService, "getJson").and.returnValue({ foo: "bar" });

                        // act
                        await subject.getClaims("token");

                        // assert
                        expect(getJsonMock).toHaveBeenCalledWith("http://sts/userinfo", 'token', 'include');
                    });

                    it("should fail when dependencies fail", async () => {
                        // arrange
                        spyOn(metadataService, "getUserInfoEndpoint").and.rejectWith(new Error("test"));

                        // act
                        try {
                            await subject.getClaims("token");
                            fail("should not come here");
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toContain("test");
                        }
                    });

                    it("should return claims", async () => {
                        // arrange
                        spyOn(metadataService, "getUserInfoEndpoint").and.resolveTo("http://sts/userinfo");
                        let expectedClaims = {
                            foo: 1, bar: "test",
                            aud: "some_aud", iss: "issuer",
                            sub: "123", email: "foo@gmail.com",
                            role: ["admin", "dev"],
                            nonce: "nonce", at_hash: "athash",
                            iat: 5, nbf: 10, exp: 20,
                        };
                        spyOn(jsonService, "getJson").and.resolveTo(expectedClaims);

                        // act
                        let claims = await subject.getClaims("token");

                        // assert
                        expect(claims).toEqual(expectedClaims);
                    });

                    it("should use settings fetchRequestCredentials to set credentials on user info request", async () => {
                        // arrange
                        spyOn(metadataService, "getUserInfoEndpoint").and.resolveTo("http://sts/userinfo");
                        let getJsonMock = spyOn(jsonService, "getJson").and.resolveTo({});

                        // act
                        await subject.getClaims("token");

                        // assert
                        expect(getJsonMock).toHaveBeenCalledWith("http://sts/userinfo", 'token', 'include');

                    });
                });

            });

        }
    }
});