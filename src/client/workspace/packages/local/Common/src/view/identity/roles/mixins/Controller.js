Ext.define('Common.view.identity.roles.mixins.Controller',{
    extend: 'Ext.Mixin',

    onMultilingual(grid, info){
        let me = this,
        viewXtype = 'rolemultilingualview',
            params = me.getViewParams(null,null, info.record);
        ViewMgr.setParams(viewXtype, params);
        me.redirectTo(`${viewXtype}/multilingual`);
    },

});

