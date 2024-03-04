Ext.define('Common.mixin.CountMessage',{
    extend: 'Common.mixin.Component',

    config:{
        countMessage: null,
        dataCount: 0
    },

    createCountMessage(config){
        return Ext.apply({
            xtype: 'component',
            userCls: 'mx-2',
            style: {
                textAlign: 'right'
            },
            ownerCmp: this
        }, config);
    },

    applyCountMessage(config, old){
        return Ext.updateWidget(old, config,this, 'createCountMessage');
    },

    updateCountMessage(config){
        config && this.add(config);
    },

    updateDataCount(){
        this.onLocalized();
    },

    onLocalized(){
        let me = this;
        me.getCountMessage().setHtml(Format.format(I18N.get('CountMessage'), `<span class="color-base">${me.getDataCount()}</span>`));
    },

    doDestroy(){
        this.destroyMembers( 'countMessage');
    }



})