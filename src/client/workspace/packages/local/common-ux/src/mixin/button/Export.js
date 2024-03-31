Ext.define('Common.mixin.button.Export', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.menu.RadioItem'
    ],

    config: {

        /**         
         * @cfg {object} exportButton Configuration for the export button.
         */
        exportButton: null

        /**
        * @cfg {Boolean} excel
        * exportButton的excel参数
        * 如果设置，则显示excel下拉菜单
        */

        /**
        * @cfg {Boolean} csv
        * exportButton的csv参数
        * 如果设置，则显示csv下拉菜单
        */

        /**
        * @cfg {Boolean} pdf
        * exportButton的pdf参数
        * 如果设置，则显示pdf下拉菜单
        */
    },

    createExportButton(config) {
        let items = [],
            cfg;
        Ext.each(['ExportSelected', 'ExportSearch', 'ExportAll'], (t) => {
            items.push({
                exportType: t,
                langText: t,
                checked: t === 'ExportSelected',
                xtype: 'menuradioitem',
                group: 'exportType',
                handler: 'onExportTypeButtonTap'
            });
        });
        if(config.excel){
            items.push({
                exportFileType: 'excel',
                text: 'Excel',
                handler: 'onExportButtonTap'
            });
        }
        if(config.pdf){
            items.push({
                exportFileType: 'pdf',
                text: 'PDF',
                handler: 'onExportButtonTap'
            });
        }
        if(config.csv){
            items.push({
                exportFileType: 'csv',
                text: 'CSV',
                handler: 'onExportButtonTap'
            });
        }
        
        cfg = Ext.apply({
            xtype: 'button',
            langTooltip: 'Export',
            iconCls: IconCls.export,
            isCrud: true,
            crudName: 'export',
            exportType: null,
            weight: 600,
            menu:{

            },
            ownerCmp: this
        }, config, this.getDefaults());

        if(items.length > 0){
            cfg.menu = {
                xtype:'menu',
                items: items
            }
        }else{
            cfg.handler = 'onExportButtonTap';
        }

        return cfg;
    },

    applyExportButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createExportButton');
    },

    updateExportButton(config) {
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('exportButton');
    }


})
