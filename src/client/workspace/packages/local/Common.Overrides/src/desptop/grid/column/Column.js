Ext.define('Common.Overrides.desktop.grid.column.Column',{
    override: 'Ext.grid.column.Column',

    config:{
        grouped: false
    },

    beforeShowMenu: function(menu) {
        var me = this,
            store = me.getGrid().getStore(),
            isGrouped = store && !!store.getGrouper(),
            groupByThis = menu.getComponent('groupByThis'),
            showInGroups = menu.getComponent('showInGroups'),
            sortAsc = menu.getComponent('sortAsc'),
            sortDesc = menu.getComponent('sortDesc');

        sortAsc.setDisabled(!store);
        sortDesc.setDisabled(!store);

        // We have no store yet, we can't group or ungroup
        if (!store) {
            groupByThis.setHidden(true);
            showInGroups.setHidden(true);

            return;
        }

        // Ensure the checked state of the ascending and descending menu items
        // matches the reality of the Store's sorters.
        //
        // We are syncing the menu state with the reality of the store.
        // Ensure its state change doesn't drive the store state
        // by suspending the groupchange event.
        menu.suspendEvent('groupchange');

        if (sortAsc) {
            me.syncMenuItemState(sortAsc);
        }

        if (sortDesc) {
            me.syncMenuItemState(sortDesc);
        }

        if (groupByThis) {
            groupByThis.setHidden(!(me.canGroup() && !store.isTreeStore) || !isGrouped);
        }

        menu.resumeEvent('groupchange');

        if (showInGroups) {
            // A TreeStore is never grouped
            showInGroups.setHidden(store.isTreeStore || !isGrouped);
            // Disable the "Show in groups" options if we're not already shown in groups
            showInGroups.setChecked(isGrouped);
            showInGroups.setDisabled(!isGrouped);
        }
    },


    initialize: function() {
        var me = this,
            grid = me.up('grid');
        //自动获取列标题
        if(grid && !me.isTreeColumn){
            let autoText = Ext.isEmpty(me.autoText) ? grid.autoText : me.autoText;
            if(autoText){
                let entityName = grid.entityName || grid.getEntityName();
                let dataIndex = me.getDataIndex();
                let text = I18N['Model'][entityName][dataIndex];
                me.setText(text);
                if(me.getTooltip()){
                    me.setTooltip(text);
                }
            }
    
        }
    
        if (me.isLeafHeader && !me.getWidth() && me.getFlex() == null) {
            me.setWidth(me.getDefaultWidth());
        }
 
        me.callParent();
 

        me.element.on({
            tap: 'onColumnTap',
            longpress: 'onColumnLongPress',
            scope: this
        });
        me.triggerElement.on({
            tap: 'onTriggerTap',
            scope: this
        });
        me.resizerElement.on({
            tap: 'onResizerTap',
            scope: this
        });
 
        if (me.isHeaderGroup) {
            me.on({
                add: 'doVisibilityCheck',
                remove: 'doVisibilityCheck',
                show: 'onColumnShow',
                hide: 'onColumnHide',
                move: 'onColumnMove',
                delegate: '> column',
                scope: me
            });
 
            me.on({
                show: 'onShow',
                scope: me
            });
        }
    }
 
});