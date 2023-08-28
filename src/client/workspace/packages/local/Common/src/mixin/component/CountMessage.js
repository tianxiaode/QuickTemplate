Ext.define('Common.mixin.component.CountMessage',{
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.crud.CountMessage'
    ],

    config:{
        fill:{},
        countMessage:{}
    },

    createCountMessage(config){
        return Ext.apply({
            xtype: 'uxcountmessage',
            weight: 600,
            ownerCmp: this
        }, config);
    },

    applyCountMessage(config, old){
        return Ext.updateWidget(old, config,this, 'createCountMessage');
    },

    updateCountMessage(config){
        config && this.add(config);
    },

    createFill(config){
        return Ext.apply({
            xtype: 'component',
            flex: 1,
            weight: 500,
            ownerCmp: this,
        }, config);
    },

    applyFill(config, old){
        return Ext.updateWidget(old, config, this, 'createFill');
    },

    updateFill(config){
        config && this.add(config);
    },

    destroy(){
        this.setCountMessage(null);
        this.setFill(null);
    }



})