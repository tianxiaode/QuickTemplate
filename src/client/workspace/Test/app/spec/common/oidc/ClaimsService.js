Ext.define('Test.spec.common.oidc.ClaimsService', {
   
    requires:[
        'Common.oidc.ClaimsService'
    ],

    statics:{
        run(){
            describe("Common.oidc.ClaimsService", () => {
                let settings;
                let subject;

                beforeEach(() =>{
                    settings = {
                        authority: "op",
                        client_id: "client",
                        loadUserInfo: true,
                    }            
                })
            
                describe("filterProtocolClaims", () => {
                    it("should filter protocol claims if enabled on settings", () => {
                        // arrange
                        Object.assign(settings, { filterProtocolClaims: true });
                        subject = Ext.create('oidc.claimsservice', {settings});

                        let claims = {
                            foo: 1,
                            bar: "test",
                            aud: "some_aud",
                            iss: "issuer",
                            sub: "123",
                            email: "foo@gmail.com",
                            role: ["admin", "dev"],
                            iat: 5,
                            exp: 20,
                            nbf: 10,
                            at_hash: "athash",
                        };
            
                        // act
                        let result = subject.filterProtocolClaims(claims);
            
                        // assert
                        expect(result).toEqual({
                            foo: 1,
                            bar: "test",
                            aud: "some_aud",
                            iss: "issuer",
                            sub: "123",
                            email: "foo@gmail.com",
                            role: ["admin", "dev"],
                            iat: 5,
                            exp: 20,
                        });
                    });
            
                    it("should not filter protocol claims if not enabled on settings", () => {
                        // arrange
                        Object.assign(settings, { filterProtocolClaims: false });
                        subject = Ext.create('oidc.claimsservice', {settings});
                        let claims = {
                            foo: 1,
                            bar: "test",
                            aud: "some_aud",
                            iss: "issuer",
                            sub: "123",
                            email: "foo@gmail.com",
                            role: ["admin", "dev"],
                            at_hash: "athash",
                            iat: 5,
                            nbf: 10,
                            exp: 20,
                        };
            
                        // act
                        let result = subject.filterProtocolClaims(claims);
            
                        // assert
                        expect(result).toEqual({
                            foo: 1,
                            bar: "test",
                            aud: "some_aud",
                            iss: "issuer",
                            sub: "123",
                            email: "foo@gmail.com",
                            role: ["admin", "dev"],
                            at_hash: "athash",
                            iat: 5,
                            nbf: 10,
                            exp: 20,
                        });
                    });
            
                    it("should filter protocol claims if specified in settings", () => {
                        // arrange
                        Object.assign(settings, {
                            filterProtocolClaims: ["foo", "bar", "role", "nbf", "email"],
                        });
                        subject = Ext.create('oidc.claimsservice', {settings});
                        let claims = {
                            foo: 1,
                            bar: "test",
                            aud: "some_aud",
                            iss: "issuer",
                            sub: "123",
                            email: "foo@gmail.com",
                            role: ["admin", "dev"],
                            iat: 5,
                            exp: 20,
                            nbf: 10,
                            at_hash: "athash",
                        };
            
                        // act
                        let result = subject.filterProtocolClaims(claims);
            
                        // assert
                        expect(result).toEqual({
                            aud: "some_aud",
                            iss: "issuer",
                            sub: "123",
                            iat: 5,
                            exp: 20,
                            at_hash: "athash",
                        });
                    });
            
                    it("should filter only protocol claims defined by default by the library", () => {
                        // arrange
                        Object.assign(settings, { filterProtocolClaims: true });
                        console.log('re-settings', settings)
                        subject = Ext.create('oidc.claimsservice', {settings});
                        let defaultProtocolClaims = {
                            nbf: 3,
                            jti: "jti",
                            auth_time: 123,
                            nonce: "nonce",
                            acr: "acr",
                            amr: "amr",
                            azp: "azp",
                            at_hash: "athash",
                        };
                        let claims = {
                            foo: 1,
                            bar: "test",
                            aud: "some_aud",
                            iss: "issuer",
                            sub: "123",
                            email: "foo@gmail.com",
                            role: ["admin", "dev"],
                            iat: 5,
                            exp: 20,
                        };
            
                        // act
                        let result = subject.filterProtocolClaims({
                            ...defaultProtocolClaims,
                            ...claims,
                        });
            
                        // assert
                        expect(result).toEqual(claims);
                    });
            
                    it("should not filter protocol claims that are required by the library", () => {
                        // arrange
                        Object.assign(settings, { filterProtocolClaims: true });
                        console.log('re-settings', settings)
                        subject = Ext.create('oidc.claimsservice', {settings});
                        let internalRequiredProtocolClaims = {
                            sub: "sub",
                            iss: "issuer",
                            aud: "some_aud",
                            exp: 20,
                            iat: 5,
                        };
                        let claims = {
                            foo: 1,
                            bar: "test",
                            email: "foo@gmail.com",
                            role: ["admin", "dev"],
                            nbf: 10,
                        };
            
                        // act
                        let items = { ...internalRequiredProtocolClaims, ...claims };
                        let result = subject.filterProtocolClaims(items);
            
                        // assert
                        // nbf is part of the claims that should be filtered by the library by default, so we need to remove it
                        delete items.nbf;
                        expect(result).toEqual(items);
            
                        // ... even if specified in settings
            
                        // arrange
                        Object.assign(settings, {
                            filterProtocolClaims: ["sub", "iss", "aud", "exp", "iat"],
                        });
            
                        // act
                        items = { ...internalRequiredProtocolClaims, ...claims };
                        result = subject.filterProtocolClaims(items);
            
                        // assert
                        expect(result).toEqual(items);
                    });
                });
            
                describe("mergeClaims", () => {
                    it("should merge claims", () => {
                        subject = Ext.create('oidc.claimsservice', {settings});

                        // arrange
                        let c1 = { a: "apple", b: "banana" };
                        let c2 = { c: "carrot" };
            
                        // act
                        let result = subject.mergeClaims(c1, c2);
            
                        // assert
                        expect(result).toEqual({ a: "apple", c: "carrot", b: "banana" });
                    });
            
                    it("should not merge claims when claim types are objects", () => {
                        subject = Ext.create('oidc.claimsservice', {settings});

                        // arrange
                        let c1 = {
                            custom: { apple: "foo", pear: "bar" }
                        };
                        let c2 = {
                            custom: { apple: "foo", orange: "peel" },
                            b: "banana",
                        };
            
                        // act
                        let result = subject.mergeClaims(c1, c2);
            
                        // assert
                        expect(result).toEqual({
                            custom: [
                                { apple: "foo", pear: "bar" },
                                { apple: "foo", orange: "peel" },
                            ],
                            b: "banana",
                        });
                    });
            
                    it("should merge claims when claim types are objects when mergeClaims settings is true", () => {
                        // arrange
                        Object.assign(settings, { mergeClaims: true });
                        subject = Ext.create('oidc.claimsservice', {settings});

                        let c1 = {
                            custom: { apple: "foo", pear: "bar" }
                        };
                        let c2 = {
                            custom: { apple: "foo", orange: "peel" },
                            b: "banana"
                        };
            
                        // act
                        let result = subject.mergeClaims(c1, c2);
            
                        // assert
                        expect(result).toEqual({
                            custom: { apple: "foo", pear: "bar", orange: "peel" },
                            b: "banana",
                        });
                    });
            
                    it("should merge same claim types into array", () => {
                        subject = Ext.create('oidc.claimsservice', {settings});

                        // arrange
                        let c1 = { a: "apple", b: "banana" };
                        let c2 = { a: "carrot" };
            
                        // act
                        let result = subject.mergeClaims(c1, c2);
            
                        // assert
                        expect(result).toEqual({ a: ["apple", "carrot"], b: "banana" });
                    });
            
                    it("should merge arrays of same claim types into array", () => {
                        subject = Ext.create('oidc.claimsservice', {settings});

                        // arrange
                        let c1 = { a: "apple", b: "banana" };
                        let c2 = { a: ["carrot", "durian"] };
            
                        // act
                        let result = subject.mergeClaims(c1, c2);
            
                        // assert
                        expect(result).toEqual({
                            a: ["apple", "carrot", "durian"],
                            b: "banana",
                        });
            
                        // arrange
                        let d1 = {
                            a: ["apple", "carrot"],
                            b: "banana",
                        };
                        let d2 = { a: ["durian"] };
            
                        // act
                        result = subject.mergeClaims(d1, d2);
            
                        // assert
                        expect(result).toEqual({
                            a: ["apple", "carrot", "durian"],
                            b: "banana",
                        });
            
                        // arrange
                        let e1 = {
                            a: ["apple", "carrot"],
                            b: "banana",
                        };
                        let e2 = { a: "durian" };
            
                        // act
                        result = subject.mergeClaims(e1, e2);
            
                        // assert
                        expect(result).toEqual({
                            a: ["apple", "carrot", "durian"],
                            b: "banana",
                        });
                    });
            
                    it("should remove duplicates when producing arrays", () => {
                        subject = Ext.create('oidc.claimsservice', {settings});

                        // arrange
                        let c1 = { a: "apple", b: "banana" };
                        let c2 = { a: ["apple", "durian"] };
            
                        // act
                        let result = subject.mergeClaims(c1, c2);
            
                        // assert
                        expect(result).toEqual({ a: ["apple", "durian"], b: "banana" });
                    });
            
                    it("should not add if already present in array", () => {
                        subject = Ext.create('oidc.claimsservice', {settings});
                        // arrange
                        let c1 = {
                            a: ["apple", "durian"],
                            b: "banana",
                        };
                        let c2 = { a: "apple" };
            
                        // act
                        let result = subject.mergeClaims(c1, c2);
            
                        // assert
                        expect(result).toEqual({ a: ["apple", "durian"], b: "banana" });
                    });
                });
            });
            
        }
    }

});