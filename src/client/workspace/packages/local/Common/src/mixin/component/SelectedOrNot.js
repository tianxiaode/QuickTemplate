Ext.define('Common.mixin.component.SelectedOrNot', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.button.Enumeration'
    ],

    hasRefresh: true,

    config: {
        selectedOrNot: {
            xtype: 'uxenumerationbutton',
            weight: 290,
            margin: '0 0 0 5px',
            enumeration: 'SelectedOrNot',
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
            container = me.getMixinContainer();
        container.add(me.getSelectedOrNot());
    }



})
