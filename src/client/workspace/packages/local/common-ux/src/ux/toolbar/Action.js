Ext.define('Common.ux.toolbar.Action', {
    extend: 'Ext.Container',
    xtype: 'uxactiontoolbar',

    mixins: [
        'Common.mixin.component.Crud',
        'Common.mixin.component.CountMessage',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.field.Search'
    ],

    userCls: 'bg-content',
    weighted: true,
    isCrudToolbar: true,
    defaultListenerScope: true,
    layout: 'vbox',

    defaults:{
        userCls: 'bg-content',
        shadow: false,
        weighted: true,
        flex: 1
    },

    config:{
        toolbar:{}
    },

    createToolbar(config) {
        return Ext.apply({
            xtype: 'toolbar',
            weight: 100,
            weighted: true,
            ownerCmp: this,
        }, config);
    },

    applyToolbar(config, old) {
        return Ext.updateWidget(old, config, this, 'createToolbar');
    },

    updateToolbar(config) {
        config && this.add(config);
    },

    updateCreateButton(config) {
        config && this.getToolbar().add(config);
    },

    updateUpdateButton(config){
        config && this.getToolbar().add(config);
    },

    updateDeleteButton(config){
        config && this.getToolbar().add(config);
    },

    updateRefreshButton(config) {
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

    doDestroy() {
        this.destroyMembers('toolbar');
    },

    privates:{
    
        
        onSearch(){
            Logger.debug(this.onSearch, arguments)
        }
    
    }


})
