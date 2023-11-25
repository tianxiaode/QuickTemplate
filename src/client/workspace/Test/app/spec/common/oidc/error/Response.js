Ext.define('Test.spec.common.oidc.error.Response', {
    requires: [
        'Common.oidc.error.Response'
    ],

    statics: {
        run() {
            describe("Common.oidc.errors.Response", () => {

                describe("letructor", () => {
            
                    it("should require a error param", () => {
                        // act
                        try {
                            Oidc.ErrorResponse.create({});
                        }
                        catch (err) {
                            expect(err).toBeInstanceOf(Error);
                            expect(err.message).toContain("error");
                            return;
                        }
            
                        fail("should not come here");
                    });
            
                    it("should read error", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"foo" });
            
                        // assert
                        expect(subject.error).toEqual("foo");
                    });
            
                    it("should read error_description", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"error", errorDescription:"foo" });
            
                        // assert
                        expect(subject.errorDescription).toEqual("foo");
                    });
            
                    it("should read error_uri", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"error", errorUri:"foo" });
            
                        // assert
                        expect(subject.errorUri).toEqual("foo");
                    });
            
                    it("should read state", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"error", userState:"foo" });
            
                        // assert
                        expect(subject.state).toEqual("foo");
                    });
            
                    it("should read url_state", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"error", urlState:"foo" });
            
                        // assert
                        expect(subject.urlState).toEqual("foo");
                    });
                });
            
                describe("message", () => {
                    it("should be description if set", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"error", errorDescription:"foo" });
            
                        // assert
                        expect(subject.message).toEqual("foo");
                    });
            
                    it("should be error if description not set", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"error" });
            
                        // assert
                        expect(subject.message).toEqual("error");
                    });
                });
            
                describe("name", () => {
                    it("should be class name", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"error" });
            
                        // assert
                        expect(subject.name).toEqual("ErrorResponse");
                    });
                });
            
                describe("stack", () => {
                    it("should be set", () => {
                        // act
                        let subject = Oidc.ErrorResponse.create({ error:"error" });
            
                        // assert
                        expect(subject.stack).not.toBeNull();
                    });
                });
            });
            
        }
    }
});