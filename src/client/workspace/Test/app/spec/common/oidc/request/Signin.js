Ext.define('Test.spec.common.oidc.request.Signin', {

    requires: [
        'Common.oidc.request.Signin'
    ],

    statics: {
        run() {
            describe("Common.oidc.request.Signin", () => {

                let subject;
                let settings;

                beforeEach(async () => {
                    settings = {
                        url: "http://sts/signin",
                        clientId: "client",
                        redirectUri: "http://app",
                        responseType: "code",
                        scope: "openid",
                        authority: "op",
                        stateData: { data: "test" },
                    };
                    subject = await Common.oidc.request.Signin.create(settings);
                });

                describe("constructor", () => {
                    ["url", "clientId", "redirectUri", "responseType", "scope", "authority"].forEach((param) => {
                        it(`should require a ${param} param`, async () => {
                            // arrange
                            Object.assign(settings, { [param]: undefined });

                            // act
                            await expectAsync(Common.oidc.request.Signin.create(settings)).toBeRejectedWithError(Format.splitCamelCase(param, '_'));
                        })
                    });

                });

                describe("url", () => {
                    let url;

                    beforeEach(async () => {
                        url = subject.url;
                    });

                    it("should include url", () => {
                        // assert
                        expect(url.indexOf("http://sts/signin")).toEqual(0);
                    });

                    it("should include client_id", () => {
                        // assert
                        expect(url).toContain("client_id=client");
                    });

                    it("should include redirect_uri", () => {
                        // assert
                        expect(url).toContain("redirect_uri=" + encodeURIComponent("http://app"));
                    });

                    it("should include response_type", () => {
                        // assert
                        expect(url).toContain("response_type=code");
                    });

                    it("should include scope", () => {
                        // assert
                        expect(url).toContain("scope=openid");
                    });

                    it("should include state", () => {
                        // assert
                        expect(url).toContain("state=" + subject.state.id);
                    });

                    it("should include prompt", async () => {
                        // arrange
                        settings.prompt = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("prompt=foo");
                    });

                    it("should include display", async () => {
                        // arrange
                        settings.display = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("display=foo");
                    });

                    it("should include max_age", async () => {
                        // arrange
                        settings.maxAge = 42;

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("max_age=42");
                    });

                    it("should include ui_locales", async () => {
                        // arrange
                        settings.ui_locales = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("ui_locales=foo");
                    });

                    it("should include id_token_hint", async () => {
                        // arrange
                        settings.idTokenHint = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("id_token_hint=foo");
                    });

                    it("should include login_hint", async () => {
                        // arrange
                        settings.loginHint = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("login_hint=foo");
                    });

                    it("should include acr_values", async () => {
                        // arrange
                        settings.acrValues = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("acr_values=foo");
                    });

                    it("should include a resource", async () => {
                        // arrange
                        settings.resource = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("resource=foo");
                    });

                    it("should include multiple resources", async () => {
                        // arrange
                        settings.resource = ["foo", "bar"];

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("resource=foo&resource=bar");
                    });

                    it("should include response_mode", async () => {
                        // arrange
                        settings.responseMode = "fragment";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("response_mode=fragment");
                    });

                    it("should include request", async () => {
                        // arrange
                        settings.request = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("request=foo");
                    });

                    it("should include request_uri", async () => {
                        // arrange
                        settings.requestUri = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("request_uri=foo");
                    });

                    it("should include extra query params", async () => {
                        // arrange
                        settings.extraQueryParams = {
                            "hd_1": "domain.com",
                            "fooFoo": "bar",
                        };

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("hd_1=domain.com&fooFoo=bar");
                    });

                    it("should store extra token params in state", async () => {
                        // arrange
                        settings.extraTokenParams = {
                            "resourceServer": "abc",
                        };

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);

                        // assert
                        expect(subject.state.extraTokenParams).toEqual({
                            "resourceServer": "abc",
                        });
                    });

                    it("should include code flow params", async () => {
                        // arrange
                        settings.responseType = "code";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("code_challenge=");
                        expect(url).toContain("code_challenge_method=S256");
                    });

                    it("should include nonce", async () => {
                        // arrange
                        settings.nonce = "random_nonce";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);
                        url = subject.url;

                        // assert
                        expect(url).toContain("nonce=");
                    });

                    it("should include url_state", async () => {
                        // arrange
                        settings.urlState = "foo";

                        // act
                        subject = await Common.oidc.request.Signin.create(settings);

                        // assert
                        expect(subject.url).toContain("state=" + subject.state.id + encodeURIComponent(Oidc.Url.URL_STATE_DELIMITER + "foo"));
                    });
                });

            });
        }
    }
});