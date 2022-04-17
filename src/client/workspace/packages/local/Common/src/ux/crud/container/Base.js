Ext.define('Common.ux.crud.container.Base',{
    extend: 'Ext.Container',
    xtype: 'uxcrudcontainer',

    isCrudPanel: true,

    mixins:[
        'Common.mixin.component.Crud',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.CountMessage',
        'Common.mixin.component.SearchField',
    ],

    config:{
        toolbarUi: 'grid',
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

    applyToolbarUi(ui){
        if(this.isPhone()) return 'dark';
        return ui;
    },

    createToolbar(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            ui: this.getToolbarUi()
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