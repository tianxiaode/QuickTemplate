Ext.define('Common.ux.toolbar.Crud', {
    extend: 'Ext.Container',
    xtype: 'uxcrudtoolbar',

    mixins: [
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
        'Common.mixin.Toolbar'
    ],

    userCls: 'bg-content',
    weighted: true,
    isCrudToolbar: true,
    layout: 'vbox',

    config:{
        toolbar:{},
        createButton:{},
        trashButton: {},
        refreshButton:{},
        searchField: {},
        spacer:{},
        countMessage:{}
    },

    updateCreateButton(config) {
        config.crudName = 'create';
        this.addToolbarItem(config, 100);
    },

    updateUpdateButton(config){
        config.crudName = 'update';
        this.addToolbarItem(config, 200);
    },

    updateTrashButton(config){
        config.crudName = 'delete';
        this.addToolbarItem(config, 300);
    },

    updateRefreshButton(config) {
        config.crudName = 'refresh';
        this.addToolbarItem(config, 400);
    },

    updateImportButton(config){
        config.crudName = 'import';
        this.addToolbarItem(config, 500);
    },

    updateExportButton(config){
        config.crudName = 'export';
        this.addToolbarItem(config, 600);
    },

    updateSearchButton(config){
        config.crudName = 'search';
        config.setLangTooltip('Search');
        this.addToolbarItem(config, 700);
    },

    updateResetButton(config){
        config.crudName = 'reset';
        config.setLangTooltip('ResetSearchValue');
        this.addToolbarItem(config, 800);
    },

    updateSearchField(config){
        config.isSearch = true;
        this.addToolbarItem(config, 900);
    },

    updateSpacer(config){
        this.addToolbarItem(config, 1000);
    },

    updateCountMessage(config){
        this.addToolbarItem(config, 1100);
    },

    updateHelpButton(config){
        this.addToolbarItem(config, 1200);
    },

    addToolbarItem(config, weight){
        let toolbar = this.getToolbar();
        if(!config) return;
        if(config.isButton && !config.isHelp ) config.isCrud = true;
        config.ownerCmp = toolbar;
        toolbar.add(config);
        weight && !config._weight && config.setWeight(weight);
    }


})
