Ext.define('Common.ux.crud.container.Base',{
    extend: 'Ext.Container',
    xtype: 'uxcrudcontainer',

    mixins:[
        'Common.mixin.component.Crud',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.CountMessage',
        'Common.mixin.component.SearchField',
    ],

    config:{
        toolbar:{
            xtype: 'toolbar',
            isCrudToolbar: true,
            weighted: true,
            shadow: false,
            weight: 10,
            layout: {
                type: 'box',
                align: 'start',
            }
        },
    },

    toolbarUi: 'grid',
    layout: 'vbox',
    includeResource: true,
    weighted: true,

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