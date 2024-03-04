Ext.define('Common.ux.toolbar.Action', {
    extend: 'Ext.Container',
    xtype: 'uxactiontoolbar',

    mixins: [
        'Common.mixin.button.Create',
        'Common.mixin.button.Trash',
        'Common.mixin.button.Refresh',
        'Common.mixin.Spacer',
        'Common.mixin.CountMessage',
        'Common.mixin.field.Search',
        'Common.mixin.Toolbar'
    ],

    userCls: 'bg-content',
    weighted: true,
    isCrudToolbar: true,
    defaultListenerScope: true,
    layout: 'vbox',

    config:{
        toolbar:{},
        createButton:{ isCrud: true, crudName: 'create', weight: 100 },
        trashButton: { isCrud: true, crudName: 'delete', weight: 300},
        refreshButton:{ isCrud: true, crudName: 'refresh', weight: 400},
        searchField: { isSearch: true, weight: 500},
        spacer:{ weight: 600 },
        countMessage:{ weight: 700}
    },

    updateCreateButton(config) {
        config && this.getToolbar().add(config);
    },

    updateUpdateButton(config){
        config && this.getToolbar().add(config);
    },

    updateTrashButton(config){
        config && this.getToolbar().add(config);
    },

    updateRefreshButton(config) {
        config && this.getToolbar().add(config);
    },

    updateSpacer(config){
        config && this.getToolbar().add(config);
    },

    updateCountMessage(config){
        config && this.getToolbar().add(config);
    },

    updateSearchField(config){
        if(!config) return;
        let me = this;
        if(Ext.platformTags.phone && me.isCrudToolbar){
            field.setUi('solo');
            field.setWidth(null);
            field.setFlex(1);
            field.setMargin('0 5px 0 0');
        }
        me.getToolbar().add(config);
    },

    privates:{
    
        
        onSearch(){
            Logger.debug(this.onSearch, arguments)
        }
    
    }


})
