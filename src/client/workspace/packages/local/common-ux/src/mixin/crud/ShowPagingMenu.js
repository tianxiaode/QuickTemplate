Ext.define('Common.mixin.crud.ShowPagingMenu', {
    extend: 'Ext.Mixin',

    onShowPagingMenuTap(sender){
        let me = this,
            isShow = !sender.getChecked();  
        me.setPaging(isShow);
    }



});