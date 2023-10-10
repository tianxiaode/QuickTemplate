Ext.define('Common.oidc.util.Jwt',{
    alternateClassName: 'OidcJwt',

    statics:{
        // IMPORTANT: doesn't validate the token
        decode(token, options){
            if (typeof token !== "string") {
                Ext.raise("Invalid token specified");
            }

            options = options || {};
            let pos = options.header === true ? 0 : 1;
            try {
                return JSON.parse(OidcJwt.base64UrlDecode(token.split(".")[pos]));
            } catch (e) {
                Ext.raise("Invalid token specified: " + e.message);
            }
        },

        b64DecodeUnicode(str) {
            return decodeURIComponent(
                atob(str).replace(/(.)/g, function(m, p) {
                    var code = p.charCodeAt(0).toString(16).toUpperCase();
                    if (code.length < 2) {
                        code = "0" + code;
                    }
                    return "%" + code;
                })
            );
        },
    
        base64UrlDecode(str) {
            let output = str.replace(/-/g, "+").replace(/_/g, "/");
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += "==";
                    break;
                case 3:
                    output += "=";
                    break;
                default:
                    throw "Illegal base64url string!";
            }
    
            try {
                return OidcJwtUtils.b64DecodeUnicode(output);
            } catch (err) {
                return atob(output);
            }
        }
    

    }
});