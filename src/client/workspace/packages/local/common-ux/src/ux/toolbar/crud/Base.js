Ext.define('Common.ux.toolbar.crud.Base', {
    extend: 'Ext.Toolbar',
    xtype: 'uxcrudtoolbar',

    mixins: [
        'Common.mixin.ComponentCreator',
        'Common.mixin.button.Create',
        'Common.mixin.button.Update',
        'Common.mixin.button.Trash',
        'Common.mixin.button.Refresh',
        'Common.mixin.button.Import',
        'Common.mixin.button.Export',
        'Common.mixin.button.Search',
        'Common.mixin.button.Reset',
        'Common.mixin.button.Help',
        'Common.mixin.Spacer',
        'Common.mixin.CountMessage',
        'Common.mixin.field.Search',
    ],

    userCls: 'bg-content',
    weighted: true,
    isCrudToolbar: true,

    config:{
        createButton:{ crudName: 'create' , weight: 100 },
        trashButton: { crudName: 'trash'  , weight: 300 },
        refreshButton:{ crudName:'refresh', weight: 400 },
        searchField: { weight: 900 },
        spacer:{ weight: 1000 },
        countMessage:{ weight: 1100 }
    },

    updateUpdateButton(config){
        this.addToolbarItem(config, 200, 'update');
    },

    updateImportButton(config){
        this.addToolbarItem(config, 500, 'import');
    },

    updateExportButton(config){
        this.addToolbarItem(config, 600, 'export');
    },

    updateSearchButton(config){
        config.setLangTooltip('Search');
        this.addToolbarItem(config, 700, 'search');
    },

    updateResetButton(config){
        config.setLangTooltip('ResetSearchValue');
        this.addToolbarItem(config, 800, 'reset');
    },

    updateHelpButton(config){
        this.addToolbarItem(config, 1200);
    },

    addToolbarItem(config, weight, crudName){
        if(!config) return;
        crudName && (config.crudName = crudName);
        if(config.isButton && !config.isHelp ) config.isCrud = true;
        this.add(config);
        weight && !config._weight && config.setWeight(weight);
    }


})
