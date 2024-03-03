Ext.define('Common.mixin.CountMessage',{
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.CountMessage'
    ],

    config:{
        countMessage:{}
    },

    createCountMessage(config){
        return Ext.apply({
            xtype: 'uxcountmessage',
            weight: 600,
            flex: 1,
            margin: '0 5px',
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

    doDestroy(){
        this.destroyMembers( 'countMessage');
    }



})