Ext.define('Common.mixin.component.SelectedOrNot', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.field.Enumeration'
    ],

    hasRefresh: true,

    config: {
        selectedOrNot: {
            xtype: 'uxenumerationfield',
            weight: 301,
            margin: '0 0 0 5px',
            enumName: 'SelectedOrNot',
            hasAllValue: false,
            autoLabel: false,
            width: 100,
            isSearch: true,
            searchName: 'type',
        },
    },

    createSelectedOrNot(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applySelectedOrNot(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createSelectedOrNot');
    },

    initialize(){
        let me = this,
            morePanel = me.up('[isMorePanel]'),
            container = me.getMixinContainer(),
            cmp = container.add(me.getSelectedOrNot());
        if(me.isPhone()){
            cmp.setUi('solo');            
        }
    }



})
