Ext.define('Test.spec.common.oidc.util.Jwt', {

    requires: [
        'Common.oidc.util.Jwt'
    ],

    statics: {

        run() {
            describe('Common.oidc.util.Jwt', () => {
                let jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMzMy9jb3JlIiwiYXVkIjoianMudG9rZW5tYW5hZ2VyIiwiZXhwIjoxNDU5MTMwMjAxLCJuYmYiOjE0NTkxMjk5MDEsIm5vbmNlIjoiNzIyMTAwNTIwOTk3MjM4MiIsImlhdCI6MTQ1OTEyOTkwMSwiYXRfaGFzaCI6IkpnRFVDeW9hdEp5RW1HaWlXYndPaEEiLCJzaWQiOiIwYzVmMDYxZTYzOThiMWVjNmEwYmNlMmM5NDFlZTRjNSIsInN1YiI6Ijg4NDIxMTEzIiwiYXV0aF90aW1lIjoxNDU5MTI5ODk4LCJpZHAiOiJpZHNydiIsImFtciI6WyJwYXNzd29yZCJdfQ.f6S1Fdd0UQScZAFBzXwRiVsUIPQnWZLSe07kdtjANRZDZXf5A7yDtxOftgCx5W0ONQcDFVpLGPgTdhp7agZkPpCFutzmwr0Rr9G7E7mUN4xcIgAABhmRDfzDayFBEu6VM8wEWTChezSWtx2xG_2zmVJxxmNV0jvkaz0bu7iin-C_UZg6T-aI9FZDoKRGXZP9gF65FQ5pQ4bCYQxhKcvjjUfs0xSHGboL7waN6RfDpO4vvVR1Kz-PQhIRyFAJYRuoH4PdMczHYtFCb-k94r-7TxEU0vp61ww4WntbPvVWwUbCUgsEtmDzAZT-NEJVhWztNk1ip9wDPXzZ2hEhDAPJ7A";

                it("should decode a jwt", () => {
                    // act
                    const result = Oidc.Jwt.decode(jwt);

                    // assert
                    expect(result).toEqual({
                        "iss": "https://localhost:44333/core",
                        "aud": "js.tokenmanager",
                        "exp": 1459130201,
                        "nbf": 1459129901,
                        "nonce": "7221005209972382",
                        "iat": 1459129901,
                        "at_hash": "JgDUCyoatJyEmGiiWbwOhA",
                        "sid": "0c5f061e6398b1ec6a0bce2c941ee4c5",
                        "sub": "88421113",
                        "auth_time": 1459129898,
                        "idp": "idsrv",
                        "amr": [
                            "password",
                        ],
                    });
                });

                it("should return undefined for an invalid jwt", () => {
                    // act
                    try {
                        Oidc.Jwt.decode("junk");
                        Logger.error("should not come here");
                    }
                    catch (err) {
                        expect(err.message).toContain("Invalid token specified");
                    }
                });
            });


        }
    }

});