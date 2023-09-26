Ext.define('Common.service.oauth.Odic', {
    alternateClassName: 'Odic',
    singleton: true,

    mixins: [
        'Ext.mixin.Observable'
    ],

    requires:[
        'Common.service.Url',
        'Common.service.HttpClient'
    ],

    /**
     * The client's id as registered with the auth server
     */ 
   clientId : '',

   /**
    * The client's redirectUri as registered with the auth server
    */
   redirectUri: '',

   /**
    * An optional second redirectUri where the auth server
    * redirects the user to after logging out.
    */
   postLogoutRedirectUri: '',

   /**
    * Defines whether to use 'redirectUri' as a replacement
    * of 'postLogoutRedirectUri' if the latter is not set.
    */
   redirectUriAsPostLogoutRedirectUriFallback: true,
   /**
    * The auth server's endpoint that allows to log
    * the user in when using implicit flow.
    */
   loginUrl: '',
   /**
    * The requested scopes
    */
   scope: 'openid profile',
   resource: '',
   rngUrl: '',
   /**
    * Defines whether to use OpenId Connect during
    * implicit flow.
    */
   oidc: true,
   /**
    * Defines whether to request an access token during
    * implicit flow.
    */
   requestAccessToken: true,
   options: null,
   /**
    * The issuer's uri.
    */
   issuer: '',
   /**
    * The logout url.
    */
   logoutUrl: '',
   /**
    * Defines whether to clear the hash fragment after logging in.
    */
   clearHashAfterLogin: true,
   /**
    * Url of the token endpoint as defined by OpenId Connect and OAuth 2.
    */
   tokenEndpoint: null,
   /**
    * Url of the revocation endpoint as defined by OpenId Connect and OAuth 2.
    */
   revocationEndpoint: null,
   /**
    * Names of known parameters sent out in the TokenResponse. https://tools.ietf.org/html/rfc6749#section-5.1
    */
   customTokenParameters: [],
   /**
    * Url of the userinfo endpoint as defined by OpenId Connect.
    */
   userinfoEndpoint: null,
   responseType: '',
   /**
    * Defines whether additional debug information should
    * be shown at the console. Note that in certain browsers
    * the verbosity of the console needs to be explicitly set
    * to include Debug level messages.
    */
   showDebugInformation: false,
   /**
    * The redirect uri used when doing silent refresh.
    */
   silentRefreshRedirectUri: '',
   silentRefreshMessagePrefix: '',
   /**
    * Set this to true to display the iframe used for
    * silent refresh for debugging.
    */
   silentRefreshShowIFrame: false,
   /**
    * Timeout for silent refresh.
    * @internal
    * depreacted b/c of typo, see silentRefreshTimeout
    */
   siletRefreshTimeout: 1000 * 20,
   /**
    * Timeout for silent refresh.
    */
   silentRefreshTimeout: 1000 * 20,
   /**
    * Some auth servers don't allow using password flow
    * w/o a client secret while the standards do not
    * demand for it. In this case, you can set a password
    * here. As this password is exposed to the public
    * it does not bring additional security and is therefore
    * as good as using no password.
    */
   dummyClientSecret: '',
   /**
    * Defines whether https is required.
    * The default value is remoteOnly which only allows
    * http for localhost, while every other domains need
    * to be used with https.
    */
   requireHttps: 'remoteOnly',
   /**
    * Defines whether every url provided by the discovery
    * document has to start with the issuer's url.
    */
   strictDiscoveryDocumentValidation: true,
   /**
    * JSON Web Key Set (https://tools.ietf.org/html/rfc7517)
    * with keys used to validate received id_tokens.
    * This is taken out of the disovery document. Can be set manually too.
    */
   jwks: null,
   /**
    * Map with additional query parameter that are appended to
    * the request when initializing implicit flow.
    */
   customQueryParams: null,
   silentRefreshIFrameName: 'oauth-oidc-silent-refresh-iframe',
   /**
    * Defines when the token_timeout event should be raised.
    * If you set this to the default value 0.75, the event
    * is triggered after 75% of the token's life time.
    */
   timeoutFactor: 0.75,
   /**
    * If true, the lib will try to check whether the user
    * is still logged in on a regular basis as described
    * in http://openid.net/specs/openid-connect-session-1_0.html#ChangeNotification
    */
   sessionChecksEnabled: false,
   /**
    * Interval in msec for checking the session
    * according to http://openid.net/specs/openid-connect-session-1_0.html#ChangeNotification
    */
   sessionCheckIntervall: 3 * 1000,
   /**
    * Url for the iframe used for session checks
    */
   sessionCheckIFrameUrl: null,
   /**
    * Name of the iframe to use for session checks
    */
   sessionCheckIFrameName: 'oauth-oidc-check-session-iframe',
   /**
    * This property has been introduced to disable at_hash checks
    * and is indented for Identity Provider that does not deliver
    * an at_hash EVEN THOUGH its recommended by the OIDC specs.
    * Of course, when disabling these checks then we are bypassing
    * a security check which means we are more vulnerable.
    */
   disableAtHashCheck: false,
   /**
    * Defines wether to check the subject of a refreshed token after silent refresh.
    * Normally, it should be the same as before.
    */
   skipSubjectCheck: false,
   useIdTokenHintForSilentRefresh: false,
   /**
    * Defined whether to skip the validation of the issuer in the discovery document.
    * Normally, the discovey document's url starts with the url of the issuer.
    */
   skipIssuerCheck: false,
   /**
    * final state sent to issuer is built as follows:
    * state = nonce + nonceStateSeparator + additional state
    * Default separator is ';' (encoded %3B).
    * In rare cases, this character might be forbidden or inconvenient to use by the issuer so it can be customized.
    */
   nonceStateSeparator: ';',
   /**
    * Set this to true to use HTTP BASIC auth for AJAX calls
    */
   useHttpBasicAuth: false,
   /**
    * Decreases the Expiration time of tokens by this number of seconds
    */
   decreaseExpirationBySec: 0,
   /**
    * The interceptors waits this time span if there is no token
    */
   waitForTokenInMsec: 0,
   /**
    * Code Flow is by defauld used together with PKCI which is also higly recommented.
    * You can disbale it here by setting this flag to true.
    * https://tools.ietf.org/html/rfc7636#section-1.1
    */
   disablePKCE: false,
   /**
    * Set this to true to preserve the requested route including query parameters after code flow login.
    * This setting enables deep linking for the code flow.
    */
   reserveRequestedRoute: false,
   /**
    * Allows to disable the timer for the id_token used
    * for token refresh
    */
   disableIdTokenTimer: false,
   /**
    * Blocks other origins requesting a silent refresh
    */
   checkOrigin: false,

    discoveryDocumentLoaded: false,

    constructor(config) {
        let me = this;
        me.mixins.observable.constructor.call(me, config);
        Ext.apply(me, AppConfig.oAuthConfig);
        me.storage = AppStorage;
    },


    loadDiscoveryDocument() {
        let me = this,
            deferred = new Ext.Deferred(),
            url = me.issuer || ''; 
        if (!url.endsWith('/')) {
            url += '/';
        }
        url += '.well-known/openid-configuration';
        if (!me.validateUrlForHttps(url)) {
            deferred.reject("issuer  must use HTTPS (with TLS), or config value for property 'requireHttps' must be set to 'false' and allow HTTP (without TLS).");
            return;
        }

        http.get(`${me.issuer}/.well-known/openid-configuration`)
            .then((response)=>{
                let doc = response.jsonData;
                if (!me.validateDiscoveryDocument(doc)) {
                    me.fireEvent('discoveryDocumentValidationError', me, error);
                    deferred.reject('discovery_document_validation_error');
                    return;
                }
                me.loginUrl = doc.authorization_endpoint;
                me.logoutUrl = doc.end_session_endpoint || me.logoutUrl;
                me.grantTypesSupported = doc.grant_types_supported;
                me.issuer = doc.issuer;
                me.tokenEndpoint = doc.token_endpoint;
                me.userinfoEndpoint = doc.userinfo_endpoint || me.userinfoEndpoint;
                me.jwksUri = doc.jwks_uri;
                me.sessionCheckIFrameUrl = doc.check_session_iframe || me.sessionCheckIFrameUrl;
                me.discoveryDocumentLoaded = true;
                me.discoveryDocumentLoadedSubject.next(doc);
                me.revocationEndpoint = doc.revocation_endpoint || me.revocationEndpoint;
                if (me.sessionChecksEnabled) {
                    me.restartSessionChecksIfStillLoggedIn();
                }

                deferred.resolve(records);
            },(response)=>{
                let error = Http.getError(response);
                me.fireEvent('discoveryDocumentLoadError', me, error);
                deferred.reject(error);
            });

        return deferred.promise;  
    },

    privates:{
        validateDiscoveryDocument(doc) {
            let me = this,
                hasError = false,
                errors;
            if (!me.skipIssuerCheck && doc.issuer !== me.issuer) {
                Ext.log('invalid issuer in discovery document', 'expected: ' + this.issuer, 'current: ' + doc.issuer);
                return false;
            }
            ['authorization_endpoint', 'end_session_endpoint', 'token_endpoint', 'revocation_endpoint', 'userinfo_endpoint', 'jwks_uri'].forEach(m=>{
                hasError = false;
                errors = me.validateUrlFromDiscoveryDocument(doc[m]);
                if(errors.length > 0){
                    Ext.log(`error validating ${m} in discovery document`, errors);
                    hasError = true;
                }
            })
            if(hasError) return false;
            if (me.sessionChecksEnabled && !doc.check_session_iframe) {
                Ext.log({level: 'warn'}, 'sessionChecksEnabled is activated but discovery document' +
                    ' does not contain a check_session_iframe field');
            }
            return true;
        },

        validateUrlFromDiscoveryDocument(url) {
            let me = this,
                errors= [];
                httpsCheck = me.validateUrlForHttps(url);
                issuerCheck = me.validateUrlAgainstIssuer(url);
            if (!httpsCheck) {
                errors.push('https for all urls required. Also for urls received by discovery.');
            }
            if (!issuerCheck) {
                errors.push('Every url in discovery document has to start with the issuer url.' +
                    'Also see property strictDiscoveryDocumentValidation.');
            }
            return errors;
        },
    
        validateUrlForHttps(url) {
            let me = this;
            if (!url) {
                return true;
            }
            let lcUrl = url.toLowerCase();
            if (me.requireHttps === false) {
                return true;
            }
            if ((lcUrl.match(/^http:\/\/localhost($|[:\/])/) ||
                lcUrl.match(/^http:\/\/localhost($|[:\/])/)) &&
                me.requireHttps === 'remoteOnly') {
                return true;
            }
            return lcUrl.startsWith('https://');
        },

        assertUrlNotNullAndCorrectProtocol(url, description) {
            if (!url) {
                Ext.raise(`'${description}' should not be null`);
            }
            if (!this.validateUrlForHttps(url)) {
                Ext.raise(`'${description}' must use HTTPS (with TLS), or config value for property 'requireHttps' must be set to 'false' and allow HTTP (without TLS).`);
            }
        },

        validateUrlAgainstIssuer(url) {
            let me = this;
            if (!me.strictDiscoveryDocumentValidation) {
                return true;
            }
            if (!url) {
                return true;
            }
            return url.toLowerCase().startsWith(me.issuer.toLowerCase());
        }
    
    } // end privates

})
