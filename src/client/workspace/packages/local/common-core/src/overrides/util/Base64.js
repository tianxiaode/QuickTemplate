Ext.define('Common.overrides.util.Base64',{
    override: 'Ext.util.Base64',

    utf8Encode(string){
        return this._utf8_encode(string);
    },

    utf8Decode(utftext){
        return this._utf8_decode(utftext);
    }
})