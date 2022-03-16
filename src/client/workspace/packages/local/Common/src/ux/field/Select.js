Ext.define('Common.ux.field.Select',{
    extend: 'Ext.field.Picker',
    xtype: 'uxselectfield',

    requires:[
        'Common.ux.panel.SelectList',
        'Common.ux.field.plugin.History',
    ],


    config:{
        store: null,
        valueField: 'id',
        displayField: 'displayName',
        itemTpl: 'selectItem',
        itemCls: 'listing',
        displayTpl: `{parent:getTranslationObjectText}{parent:separator}{displayName:translationItem(values,'displayName')}`,
        selection: null, 
        editable: false,
        hasHistory: true,
        queryMode: 'remote',
    },

    floatedPicker: {
        xtype: 'uxselectlist',
        zIndex: 20
    },
    picker: 'floated',
    clearable:true,


    initialize(){
        let me = this;
        if(me.getHasHistory()){
            me.addPlugin({
                type: 'fieldhistory',
                id: 'history'
            })
        }
        me.callParent();
    },

    createFloatedPicker(){
        var me = this,
            //defaultConfig = Ext.platformTags.phone ? ViewMgr.phoneConfig : ViewMgr.desktopConfig,
            result = Ext.merge({
                ownerCmp: me,
                zIndex: 1000,
                //title: `${I18N.get('Select')}${me.getLabel()}`,
                store: me.getStore(),
                listeners: {
                    select: me.onListSelected,
                    scope: me
                },
                itemTpl: me.getItemTpl(),
                itemCls: me.getItemCls(),
                searchFieldName: me.getDisplayField(),
                queryMode: me.getQueryMode(),
            }, me.getFloatedPicker());

        return result;
    },

    onListSelected(sender, selected){
        let me = this;
        me.setValue(selected.data);
    },

    applyDisplayTpl(displayTpl) {
        if (displayTpl && !displayTpl.isTemplate) {
            displayTpl = new Ext.XTemplate(displayTpl);
        }

        return displayTpl;
    },

    applyValue(value, oldValue){
        let me = this;
        if(Ext.isObject(value)){
            me.setSelection(value);
            return value[me.getValueField()];
        }
        if(Ext.isString(value) || Ext.isNumber(value)){
            let selection = { };
            selection[me.getValueField()] = value;
            selection[me.getDisplayField()] = value;
            me.setSelection(selection);
            return value;
        }
        me.setSelection(null);
        return value;
    },

    updateValue(value, oldValue){
        let me = this,
            selection = me.getSelection();
        if(!selection){
            me.fireEvent('change', me, value, oldValue);
            return;
        }
        me.getPlugin('history').addHistory(selection);
        me.fireEvent('change', me, value, oldValue);
    },

    updateSelection(selection){
        this.setInputValue(selection);
    },

    showPicker(){
        var me = this,
            picker = me.getPicker(),
            store = me.getStore(),
            value = me.getSelection();
        
        me.callParent(arguments);  
        if(!value &&  !store.isLoaded()) {
            store.load()
        }else{
            picker.setSearchValue(value);
        }
        me.updatePicker(me.getPicker());

    },

    applyStore(store) {
        if (store) {
            store = Ext.data.StoreManager.lookup(store);
        }

        return store;
    },

    updateStore(store, oldStore) {
        var me = this;

        if (oldStore) {
            if (oldStore.getAutoDestroy()) {
                oldStore.destroy();
            }
            else {
                oldStore.byValue = oldStore.byText = Ext.destroy(oldStore.byValue, oldStore.byText);
            }
        }

        if (store) {
            store.on({
                scope: me,
                load: {
                    fn: 'onStoreLoad',
                    priority: -1
                },
            });

        }
    },

    onStoreLoad(store, records){
        let me = this,
            selection = me.getSelection();
        if(!selection) return;
        let find = store.findRecord(me.getValueField(), selection && selection[me.getValueField()], 0, false, false, true );
        if(!find) return;
        me.getPicker().setSelected(find);
    },


    clearValue() {
        var me = this;

        me.setSelection(null);
        me.forceSetValue(null);

        me.syncEmptyState();
    },


    applyInputValue(value) {
        let me = this,
            field = me.getDisplayField(),
            displayObj = me.getSelection() || { parent: null };
        if(!displayObj[field]) displayObj[field] = null;
        return me.getDisplayTpl().apply(displayObj);
    },



})