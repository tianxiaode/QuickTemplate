Ext.define('Oauth.JwtUtils',{
    alternateClassName: 'JwtUtils',

    statics:{
        // IMPORTANT: doesn't validate the token
        decode(token){
            try {
                return JSON.parse(b64DecodeUnicode(token));
            }
            catch (err) {
                Ext.raise("JwtUtils.decode", err);
            }
        }
    }
});