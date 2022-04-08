Ext.define('Common.mixin.component.CountMessage',{
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.crud.CountMessage'
    ],

    config:{
        fill:{
            xtype: 'component',
            flex: 1,
            weight: 499
        },
        countMessage:{
            xtype: 'uxcountmessage',
            weight: 500,
        }
    },

    hasCountMessage: true,

    createCountMessage(newCmp){
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyCountMessage(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createCountMessage');
    },

    createFill(newCmp){
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyFill(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createFill');
    },

    initialize(){
        let me = this,
            container = me.getMixinContainer();
        if(!me.hasCountMessage || me.isPhone()) return;
        container.add(me.getFill());
        container.add(me.getCountMessage());
    }



})