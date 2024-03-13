Ext.define('Common.mixin.plugin.ListPaging',{
    extend: 'Common.mixin.Base',

    requires:[
        'Ext.dataview.plugin.ListPaging'
    ],

    config:{
        listPaging: true
    },

    listPagingPlugin: null,

    updateListPaging(value){
        this.changePagingType(false);
    },

    doDestroy() {
        this.destroyMembers( 'listPagingPlugin');
    }


})