Ext.define('Common.mixin.crud.ShowPagingMenu', {
    extend: 'Ext.Mixin',

    onShowPagingMenuTap(sender){
        this.setPagingMode(!sender.getChecked() ? 'toolbar' : 'listpaging');
        sender.up().setHidden(true);
    }



});