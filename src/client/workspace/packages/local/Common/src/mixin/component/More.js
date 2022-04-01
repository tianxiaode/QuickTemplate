Ext.define('Common.mixin.component.More', {
    extend: 'Common.mixin.component.Base',

    config: {
        moreButton: {
            xtype: 'button',
            iconCls: 'md-icon-more-horiz',
            ui: 'plain',
        },
    },

    hasMore: true,

    createMoreButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            handler: this.onSwitchSearchPanel
        }, newCmp);
    },

    applyMoreButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createMoreButton');
    },

    initialize(){
        let me = this,
            header = me.getHeader && me.getHeader(),
            button = me.getMoreButton();
        header && header.add(button);
        let menu = button.getMenu(),
            sortFields = me.getSortFields();
        console.log(sortFields);

    },

    getSortFields(){
        let me = this,
            list = me.down('[isCrudList]');
        if(!list) return ;
        return list.getStore().sortFields;
    }

})
