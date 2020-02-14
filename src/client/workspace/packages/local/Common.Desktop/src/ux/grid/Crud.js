Ext.define('Common.Desktop.ux.grid.Crud',{
    extend: 'Ext.grid.Grid',
    xtype: 'crudgrid',

    requires: [
        'Ext.layout.HBox',
        'Common.Shared.ux.field.Search',
        'Common.Desktop.ux.grid.CrudController',
        'Common.Desktop.mixin.grid.DeletedMessageTemplate',
    ],

    mixins:[
        'Common.Desktop.mixin.grid.StandardButtons',
    ],

    isCrudGrid: true,

    config:{
        //自定义属性
        //模型名称
        entityName: null,

        //列自动获取标题

        autoLoadStore: true,

        //默认按钮
        buttons:{
            create: true,
            edit: true,
            delete: true,
            refresh: true,
            search: true,
            fill: true,
            countMessage: true            
        },
        grouped: false,
        doubleTapToEdit: false

   
    },

    autoText:true,
    emptyText: I18N.EmptyText,    

    selectable:{
        checkbox: true
    },

    controller: 'crudgrid',

    bind: { store: '{mainStore}'},        

    //将实体名称首字母转大写
    applyEntityName: function(entityName){
        if(Ext.isEmpty(entityName)) Ext.raise('No entityName defined');
        return Ext.String.capitalize(entityName);
    }


})