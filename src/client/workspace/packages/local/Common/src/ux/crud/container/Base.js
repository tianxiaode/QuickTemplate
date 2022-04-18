Ext.define('Common.ux.crud.container.Base',{
    extend: 'Ext.Container',
    xtype: 'uxcrudcontainer',

    isCrudPanel: true,

    mixins:[
        'Common.mixin.component.Crud',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.SearchField',
    ],

    config:{
        toolbar:{
            xtype: 'toolbar',
            isCrudToolbar: true,
            weighted: true,
            shadow: false,
            weight: 10,
        },
    },

    layout: 'vbox',
    weighted: true,
    toolbarUi: 'grid',

    createToolbar(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            ui: this.toolbarUi
        }, newCmp);
    },

    applyToolbar(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createToolbar');
    },

    updateToolbar(config){
        if(config) this.add(config);
        this.onLocalized();
    },


})