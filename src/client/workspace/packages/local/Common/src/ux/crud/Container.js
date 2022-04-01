Ext.define('Common.ux.crud.Container',{
    extend: 'Ext.Container',
    xtype: 'uxcrudcontainer',

    requires:[
        'Common.ux.field.Search',
        'Common.ux.crud.CountMessage'
    ],

    mixins:[
        'Common.mixin.component.Crud',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.CountMessage',
        'Common.mixin.component.SearchField',
    ],

    config:{
        toolbar:{
            xtype: 'toolbar',
            ui: 'grid',
            isCrudToolbar: true,
            weighted: true,
            shadow: false,
        }
    },


    layout: 'vbox',
    includeResource: true,

    createToolBar(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyToolBar(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createToolBar');
    },

    updateToolbar(config){
        if(config) this.insert(0,config);
    }

})