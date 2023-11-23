Ext.define('Test.spec.common.oidc.response.Signout', {
    requires: [
        'Common.oidc.response.Signout'
    ],

    statics: {
        run() {
            describe("Common.oidc.response.Signout", () => {

                describe("letructor", () => {

                    it("should read error", () => {
                        // act
                        let subject = Ext.create('oidc.response.signout', new URLSearchParams("error=foo"));

                        // assert
                        expect(subject.error).toEqual("foo");
                    });

                    it("should read error_description", () => {
                        // act
                        let subject = Ext.create('oidc.response.signout', new URLSearchParams("error_description=foo"));

                        // assert
                        expect(subject.errorDescription).toEqual("foo");
                    });

                    it("should read error_uri", () => {
                        // act
                        let subject = Ext.create('oidc.response.signout', new URLSearchParams("error_uri=foo"));

                        // assert
                        expect(subject.errorUri).toEqual("foo");
                    });

                    it("should read state", () => {
                        // act
                        let subject = Ext.create('oidc.response.signout', new URLSearchParams("state=foo"));

                        // assert
                        expect(subject.state).toEqual("foo");
                    });
                });
            });

        }
    }

});