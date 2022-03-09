Ext.define('Common.shared.mixin.ImageLoad', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            onLoad: 'onLoad',
            onError: 'onError'
        }
    },

    config: {
        url: null,
    },

    useTooltip: false,
    useAjax: false,
    getHolder(){
        return URI.getResource('holder');
    },

    applyUrl(url){
        let me = this,            
            holder = me.getHolder();
        if(Ext.isEmpty(url)) {
            if(me.useHolder) {
                me.setSrc(holder);
                return;
            };
            me.setSrc(Ext.BLANK_IMAGE_URL);
            return;
        }
        me.imageHash = url;
        let has = Config.getImage(url);
        if(has){
            url = has;
        }
        url = url.includes('http') ? url : URI.crud('File', url) ;
        if(me.useAjax && !url.includes('blob:')) {
            Http.get(url, null, null,null,true)
                .then(me.loadImageSuccess, me.loadImageFailure,null,me);
            return url;
        };
        me.setSrc(url);
        return url;
    },

    onError(e) {
        let me = this;
        me.setSrc(me.getHolder());
        me.useTooltip = false;
    },

    onLoad(e){
        let me = this,
            src = me.getSrc();
        if(src.includes('404'))return;
        if(Ext.platformTags.phone) return;
        if(!me.useTooltip) {
            me.setTooltip(null);
            return;
        }
        me.setTooltip({
            maxWidth: 500,
            maxHeight: 500,
            html: `<img style="width:100%;" src="${me.getSrc()}">`
        });    
    },

    loadImageSuccess(response){
        let me = this,
            blob = Http.getBlobData(response, Format.mimeType.jpg),
            url = URL.createObjectURL(blob);
        Config.setImage(me.imageHash, url);
        me.setSrc(url);
    },

    loadImageFailure(response){
        this.setSrc(this.getHolder());
    }

});