Ext.define('Common.Desktop.view.base.grid.PagingGrid',{
    extend: 'Common.Desktop.view.base.grid.Grid',
    xtype: 'basePagingGrid',

    isPagingGrid: true,

    requires:[
        'Common.Desktop.view.base.grid.PagingGridController'
    ],

    config:{
          //默认按钮
          buttons:{
            first: true,
            prev: true,
            pageNumber: true,
            pageCount: true,
            next: true,
            last: true,
            create: true,
            edit: true,
            delete: true,
            refresh: true,
            search: true,
            fill: true,
            countMessage: true            
        }

      
    },

    controller: 'basePagingGrid'

})