Ext.define('Common.mixin.grid.ActionColumn', {
    extend: 'Common.mixin.Component',

    requires: [
        'Common.service.IconCls'
    ],

    config: {
        multilingualTool: null,
        updateTool: {},
        deleteTool: {},
        actionColumn: {},
    },

    actionColumnScope: null,


    createActionColumn(config) {
        let me = this,
            cell = config.cell || {},
            tools = cell.tools || {},
            multilingualTool = me.getMultilingualTool(),
            updateTool = me.getUpdateTool(),
            deleteTool = me.getDeleteTool();
        delete config.cell;
        if(multilingualTool){
            tools.multilingual = Ext.apply({
                iconCls: IconCls.language +' color-base',
                langTooltip: 'Multilingual',
                handler: 'onMultilingualToolTap',
                hidden: true,
                weight: 300,    
            }, multilingualTool);
        }
        if(updateTool){
            tools.update = Ext.apply({
                iconCls: IconCls.update +' color-base',
                langTooltip: 'Edit',
                handler: 'onUpdateToolTap',
                weight: 100,    
                hidden: true,
            }, updateTool);
        }
        if(deleteTool){
            tools.delete = Ext.apply({
                iconCls: IconCls.delete +' color-alert',
                langTooltip: 'Delete',
                handler: 'onDeleteToolTap',
                weight: 200,    
                hidden: true,
            }, deleteTool);
        }
        Ext.Object.each(tools, (key, tool)=>{
            if(!tool.iconCls.includes('mx-1')) tool.iconCls = tool.iconCls +' mx-1';
        });
        cell.tools = tools;
        return Ext.apply({
            xtype: 'gridcolumn',
            autoText: false,
            text: '...',
            menu: false,
            align: 'center',
            renderer: me.onActionColumnRenderer.bind(me),
            cell: cell,
        }, config);
    },

    applyActionColumn(config, old) {
        return Ext.updateWidget(old, config, this, 'createActionColumn');
    },

    afterInitialize() {
        let me = this,
            columns = me.getColumns(),
            ln = columns.length,
            actionColumn = me.getActionColumn();
        actionColumn && me.insertColumn(ln, actionColumn);
    },

    getActionContainer() {
        return this.up('[_permissions]');
    },

    onActionColumnRenderer(value, record, dataIndex, cell, column) {
        let me = this
            actionContainer = me.up('[_permissions]'),
            permissions = actionContainer.getPermissions(),
            tools = cell.getTools();
        Ext.each(tools, tool=>{      
            let cls = tool.getIconCls();

            //设置作用域
            tool.scope = actionContainer;

            //根据权限设置按钮显示状态
            if(cls.includes(IconCls.language)) {
                tool.setHidden(!permissions.update);
            }else if(cls.includes(IconCls.update)) {
                tool.setHidden(!permissions.update);
            }else if(cls.includes(IconCls.delete)) {
                tool.setHidden(!permissions.delete);
            }
        })

        // 自定义渲染器
        if(me.afterActionColumnRenderer){
            return me.afterActionColumnRenderer(value, record, dataIndex, cell, column, permissions, tools);
        }
        return '';
    },

    doDestroy() {
        this.destroyMembers('actionColumn', 'multilingualTool', 
        'updateTool', 'deleteTool', 'actionColumnScope');
    }


})