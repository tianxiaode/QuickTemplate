Ext.define('Common.oidc.util.Url', {

    statics: {
        URL_STATE_DELIMITER: ';',
        readParams(url, responseMode){
            if (!url) throw new Error("Invalid URL");
            // the base URL is irrelevant, it's just here to support relative url arguments
            let parsedUrl = new URL(url, "http://127.0.0.1"),
                params = parsedUrl[responseMode === "fragment" ? "hash" : "search"];
            return new URLSearchParams(params.slice(1));
        },
        }
},()=>{
    window.Oidc = window.Oidc || {};
    Oidc.Url = Common.oidc.util.Url;

});