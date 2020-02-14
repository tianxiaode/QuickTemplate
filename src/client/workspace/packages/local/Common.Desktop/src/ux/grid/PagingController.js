Ext.define('Common.Desktop.ux.grid.PagingController',{
    extend: 'Common.Desktop.ux.grid.CrudController',
    alias: 'controller.paginggrid',
 
    mixins:[
        'Common.Desktop.mixin.grid.Paging'
    ],


});
