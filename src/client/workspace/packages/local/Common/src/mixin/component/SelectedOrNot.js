Ext.define('Common.mixin.component.SelectedOrNot', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.button.Enumeration'
    ],

    config: {
        selectedOrNot: {}
    },

    createSelectedOrNot(config) {
        return Ext.apply({
            xtype: 'uxenumerationbutton',
            weight: 290,
            margin: '0 0 0 5px',
            enumeration: 'SelectedOrNot',
            isSearch: true,
            searchName: 'type',
            ownerCmp: this,
        }, config);
    },

    applySelectedOrNot(config, old) {
        return Ext.updateWidget(old, config, this, 'createSelectedOrNot');
    },

    updateSelectedOrNot(config){
        config && this.add(config);
    },


    destroy() {
        this.setSelectedOrNot(null);
    }



})
