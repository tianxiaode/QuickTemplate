/**
 * 自定义的IFrame组件
 */
Ext.define('Common.Shared.ux.Iframe',{
    extend: 'Ext.Component',

    alias: 'widget.uxiframe',

    loadMask: I18N.Loading,
    config:{
        src: 'about:blank',
    },

    defaultSrc : 'about:blank',
    template: [{
        reference: 'iframeElement',
        tag: 'iframe',
        width: '100%',
        height: '100%',
        style: 'border: none'
    }],

    initialize(){
        let me = this;
        me.callParent();
        me.iframeElement.on('load', me.onIframeLoad ,me);
    },

    onIframeLoad: function() {
        var me = this,
            el = me.up(),
            doc = me.getDoc();

        if (doc) {
            if(el) el.unmask();
            me.fireEvent('load', this);

        } else if (me.src) {

            if(el) el.unmask();
            me.fireEvent('error', this);
        }


    },

    getBody: function() {
        var doc = this.getDoc();
        return doc.body || doc.documentElement;
    },

    getDoc: function() {
        try {
            return this.getWin().document;
        } catch (ex) {
            return null;
        }
    },

    getWin: function() {
        var me = this,
            name = me.frameName,
            win = Ext.isIE ? me.iframeElement.dom.contentWindow : window.frames[name];
        return win;
    },

    getFrame: function() {
        var me = this;
        return me.iframeElement.dom;
    },

    applySrc(value){
        let me = this;
        if(Ext.isEmpty(value)) value = me.defaultSrc;
        me.load(value);
        return value;
    },

    load: function (src) {
        var me = this,
            el = me.up(),
            text = me.loadMask,
            frame = me.getFrame();

        if (me.fireEvent('beforeload', me, src) !== false) {
            if (text && el) {
                el.mask(text);
            }

            frame.src = src;
        }
    }

})