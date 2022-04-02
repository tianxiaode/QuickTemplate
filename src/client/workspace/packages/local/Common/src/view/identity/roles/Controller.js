Ext.define('Common.view.identity.roles.Controller',{
    extend: 'Common.ux.crud.controller.Base',
    alias: 'controller.rolecontroller',

    requires:[
        'Common.view.identity.roles.Edit'
    ],

    onMultilingual(grid, info){
        let me = this,
        viewXtype = 'rolemultilingualview',
            params = me.getViewParams(null,null, info.record);
        ViewMgr.setParams(viewXtype, params);
        me.redirectTo(`${viewXtype}/multilingual`);
    },

})