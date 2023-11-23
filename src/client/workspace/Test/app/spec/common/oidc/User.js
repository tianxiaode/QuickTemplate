Ext.define('Test.spec.common.oidc.User', {
    requires: [
        'Common.oidc.User'
    ],

    statics: {
        run() {
            describe("Common.oidc.User", () => {

                let now;

                beforeEach(() => {
                    now = 0;
                    spyOn(Oidc.Timer, "getEpochTime").and.callFake(() => now);
                });

                describe("expired", () => {
                    it("should calculate how much time left", () => {
                        let subject = Ext.create('oidc.user', { expiresAt: 100 });
                        expect(subject.isExpired()).toEqual(false);

                        // act
                        now += 100;

                        // assert
                        expect(subject.isExpired()).toEqual(true);
                    });
                });

                describe("scopes", () => {
                    it("should return list of scopes", () => {
                        subject = Ext.create('oidc.user', { scope: 'foo' });

                        // assert
                        expect(subject.getScopes()).toEqual(["foo"]);

                        subject = Ext.create('oidc.user', { scope: 'foo bar' });

                        // assert
                        expect(subject.getScopes()).toEqual(["foo", "bar"]);

                        subject = Ext.create('oidc.user', { scope: 'foo bar baz' });

                        // assert
                        expect(subject.getScopes()).toEqual(["foo", "bar", "baz"]);
                    });
                });
            });

        }
    }

});