Ext.define('Common.Desktop.ux.grid.Paging',{
    extend: 'Common.Desktop.ux.grid.Crud',
    xtype: 'paginggrid',

    isPagingGrid: true,

    requires:[
        'Common.Desktop.ux.grid.PagingController'
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

    controller: 'paginggrid'

})