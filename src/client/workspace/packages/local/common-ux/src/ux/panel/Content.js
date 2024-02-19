Ext.define('Common.ux.panel.Content', {
    extend: 'Ext.Container',
    xtype: 'uxcontentpanel',

    requires: [
        'Common.ux.toolbar.Action',
        'Common.ux.toolbar.Paging',
        'Common.ux.grid.Grid',
        'Common.ux.grid.Tree',
        'Common.ux.dataview.List'
    ],

    layout: 'vbox',
    weighted: true,
    flex: 1,
    includeResource: true,
    userCls: 'bg-content',

    config: {
        toolbar: {
            xtype: 'uxactiontoolbar',
            weight: 100,
        },
        list: {
            xtype: 'uxgrid',
            weight: 200,
            flex: 1,
        },
        paging: null
    },

    createToolbar(config) {
        return Ext.apply({ ownerCmp: this }, config);
    },

    applyToolbar(config, old) {
        return Ext.updateWidget(old, config, this, 'createToolbar');
    },

    updateToolbar(config) {
        config && this.add(config);
    },

    createList(config) {
        let me = this;
        return Ext.apply({
            ownerCmp: me,
            listeners: {
                select: me.onListSelect,
                deselect: me.onListDeselect,
                scope: me
            }
        }, config);
    },

    applyList(config, old) {
        return Ext.updateWidget(old, config, this, 'createList');
    },

    updateList(config) {
        this.onStoreChange(config.getStore());
        config && this.add(config);
    },

    createPaging(config) {
        return Ext.apply({
            xtype: 'uxpagingtoolbar',
            ownerCmp: this
        }, config);
    },

    applyPaging(config, old) {
        return Ext.updateWidget(old, config, this, 'createPaging');
    },

    updatePaging(config) {
        config && this.add(config);
    },

    /**
     * 更新CRUD按钮状态
     */
    refreshButtons(allowUpdate ,allowDelete){
        let me = this;
        me.setButtonDisabled('update', !allowUpdate);
        me.setButtonDisabled('delete', !allowDelete);
    },


    doDestroy() {
        let me = this;
        me.destroyMembers('actionToolbar', 'grid', 'paging');
    },

    privates: {
        onStoreChange(store) {
            let me = this,
                resourceName = store.getResourceName(),
                entityName = store.getEntityName();
            me.setResourceName(resourceName);
            me.setEntityName(entityName);
            me.setPermissionGroup(resourceName);
            me.initButtons(me.permissions);
            Logger.debug(this.onStoreChange, me.getPermissionGroup(), me.permissions);
        },

        initButtons(permissions){
            let me = this;
            me.setButtonHidden('create', !permissions.create);
            me.setButtonHidden('update', !permissions.update);
            me.setButtonHidden('delete', !permissions.delete);
        },

        getButtons() {
            let me = this,
                buttons = me.buttons;
            if (!buttons) {
                buttons = me.getToolbar().query('[isCrud]');
                me.buttons = {};
                buttons.forEach(b => {
                    let name = b.crudName;
                    me.buttons[name] = b;
                    b.setHandler(me[`on${Ext.String.capitalize(name)}`]);
                });
            }
            Logger.debug(me.getButtons, me.buttons)
            return me.buttons;
        },

        /**
         * 获取按钮
         * @param {按钮的key} key 
         */
        getButton(key) {
            let buttons = this.getButtons();
            return buttons[key];
        },


        setButtonHidden(key, hidden){
            let button = this.getButton(key) ;
            button && button.setHidden(hidden);
        },
    
        setButtonDisabled(key, disabled){
            let button = this.getButton(key) ;
            button && button.setDisabled(disabled);
        },

    

        onListSelect() {

        },

        onListDeselect() {

        },

        onCreateEntity() {

        },

        onBeforeCreateEntity() {

        },

        doCreateEntity() {

        },

        onUpdateEntity() {

        },

        onBeforeUpdateEntity() {

        },

        doUpdateEntity() {

        },

        onDeleteEntity() {

        },

        onBeforeDeleteEntity() {

        },

        doDeleteEntity() {

        },

        onRefreshStore() {
        },

        onSearch() {

        },

        onBeforeSearch() {

        },

        doSearch() {

        }
    }

})