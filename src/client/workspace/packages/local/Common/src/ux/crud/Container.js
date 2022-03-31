Ext.define('Common.ux.crud.Container',{
    extend: 'Ext.Container',

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
        }
    },


    layout: 'vbox',
    cls: 'bg-white',

    applyToolbar(){

    },

    getButtonContainer(){
        return this.getToolBar();
    }
})