Ext.define('Common.mixin.button.Export', {
    extend: 'Common.mixin.Component',

    requires: [
        'Common.service.Constant',
        'Ext.menu.RadioItem',
        'Ext.menu.Separator'
    ],

    config: {

        /**         
         * @cfg {object} exportButton Configuration for the export button.
         */
        exportButton: null

        /**
        * @cfg {Array} format
        * exportButton的导出格式参数
        * 如果不设置，则默认导出格式为csv、excel和pdf
        */

        /**
        * @cfg {Boolean} isExportAll
        * exportButton是否显示导出全部数据菜单项
        */

    },


    createExportButton(config) {
        let me = this,
            defaults = me.getDefaults(),
            queryScope = defaults.queryScope || undefined,
            typeItems = me.getExportTypeMenuItems(config, queryScope),
            formatItems = me.getExportFormatMenuItems(config, queryScope),
            cfg;
        cfg = Ext.apply({
            xtype: 'button',
            langTooltip: 'Export',
            iconCls: IconCls.export,
            isCrud: true,
            crudName: 'export',
            exportType: null,
            weight: 600,
            menu:{
                items: [...formatItems, {xtype:'menuseparator'},...typeItems]
            },
            ownerCmp: this
        }, config, this.getDefaults());
        return cfg;
    },

    applyExportButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createExportButton');
    },

    updateExportButton(config) {
        config && this.add(config);
    },

    /**
     * 获取导出类型菜单项
     * @private
     */
    getExportTypeMenuItems(config, queryScope) {
        let types = [Constant.EXPORT_TYPE_SELECTED, Constant.EXPORT_TYPE_SEARCH],
            items = [];
        if(config.isExportAll) types.push(Constant.EXPORT_TYPE_ALL);
        Ext.each(types, (t) => {
            items.push({
                exportType: t,
                langText: t,
                checked: t === Constant.EXPORT_TYPE_SELECTED,
                xtype: 'menuradioitem',
                group: 'exportType',
                queryScope: queryScope,
                handler: 'onExportTypeButtonTap'
            });
        });
        return items;
    },

    /**
     * 获取导出文件类型菜单项
     * @private
     */
    getExportFormatMenuItems(config, queryScope) {
        let format = config.format || [Constant.EXPORT_FORMAT_CSV, Constant.EXPORT_FORMAT_EXCEL, Constant.EXPORT_FORMAT_PDF],
            items = [];
        Ext.each(format, (f) => {
            items.push({
                exportFormat: f,
                text: f.toUpperCase(),
                queryScope: queryScope,
                handler: 'onExportButtonTap'
            });
        });
        return items;
    },

    doDestroy(){
        this.destroyMembers('exportButton');
    }


})
