Ext.define('Common.shared.ux.dataview.ChipView',{
    extend: 'Ext.dataview.ChipView',
    xtype: 'uxchipview',

    requires:[
        'Common.shared.ux.button.Refresh'
    ],

    template: [
        {
            reference: 'toolElement',
            cls: 'd-flex justify-content-end',
            children:[
                {
                    reference: 'eraseElement',
                    cls: 'x-fa fa-eraser text-primary pr-3 cursor-pointer d',
                },
                {
                    reference: 'refreshElement',
                    cls: 'x-fa fa-undo text-primary cursor-pointer d',
                }
            ]
        },
        {
            reference: 'bodyElement',
            cls: Ext.baseCSSPrefix + 'body-el',
            uiCls: 'body-el'
        }
    ],

    hasRefresh: true,
    hasErase: false,

    initialize(){
        let me = this;
        me.callParent(arguments);
        if(me.hasRefresh) {
            me.refreshElement.removeCls('d');
            me.refreshElement.on('tap', me.onRefreshStore, me);
        }
        if(me.hasErase) {
            me.eraseElement.removeCls('d');
            me.eraseElement.on('tap', me.onClearSelected, me);
        }
    },

    onRefreshStore(){
        this.getStore().load();
    },

    onClearSelected(){
        this.getSelectable().deselectAll();
    },


})