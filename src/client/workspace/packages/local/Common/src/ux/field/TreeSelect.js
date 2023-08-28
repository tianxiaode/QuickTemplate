Ext.define('Common.ux.field.TreeSelect',{
    extend: 'Ext.field.Picker',
    xtype: 'uxtreeselectfield',

    isTreeSelect: true,
    requires:[
        'Common.ux.panel.SelectList',
        'Common.ux.field.plugin.History',
        'Ext.data.TreeStore'
    ],

    //displayTpl: `{parent:getTranslationObjectText}{parent:separator}{displayName:translationItem(values,'displayName')}`,
    config:{
        store:{
            type: 'tree',
            model: 'Common.data.model.TreeBase',
            autoLoad: false,
            //rootVisible: false,
            defaultRootId: null,
            proxy: {
                type: 'format',
            }    
        },
        valueField: 'id',
        displayField: 'displayName',
        displayTpl: `{parent:getTranslationObjectText}{parent:separator}{displayName:translationItem(values,'displayName')}`,
        selection: null, 
        editable: false,
        hasHistory: true,
        onlyLeaf: true,
        rootVisible: false
    },


    floatedPicker: {
        xtype: 'tree',
        minHeight: 300,
        maxHeight: 400,
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
        let me = this,
            entityName = me.entityName,
            store = me.getStore();
        store.setRoot(me.getRoot());
        store.setRootVisible(me.getRootVisible());
        store.getProxy().setUrl(URI.crud(entityName));
        let result = Ext.merge({
                ownerCmp: me,
                //title: `${I18N.get('Select')}${me.getLabel()}`,
                hideHeaders: true,               
                store: store,
                columns:[
                    { 
                        xtype: 'treecolumn',
                        autoText: false,
                        dataIndex: me.getDisplayField(), 
                        renderer: Format.girdHighlight,
                        flex: 1
                     },
                ],            
                listeners: {
                    select: me.onTreeSelected,
                    //nodeexpand: me.onNodeExpand,
                    scope: me
                },
            }, me.getFloatedPicker());
        return result;
    },

    onTreeSelected(sender, selected){
        let me = this,
            old = me.getSelection(),
            onlyLeaf = me.getOnlyLeaf(),
            selection = Ext.isArray(selected) ? selected[0] : selected,
            data = selection.data;        
        if(selection.id === (old && old.id)) return;
        if( onlyLeaf && !data.leaf) return;
        data.parent = selection.parentNode && selection.parentNode.data;
        me.setValue(data);
        me.getPicker().hide();
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
        };
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
            root = store.getRoot(),
            value = me.getSelection(),
            selection = picker.getSelectable().getSelection()[0];
        
        me.callParent(arguments);
        if(root.isExpanded()){
            if(value){
                if(value.id !== (selection && selection.id)){
                    let root = store.getRoot();
                    me.findValueNode(value, root);                    
                }
            }    
        }else{
            root.expand();

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
            if (oldStore.getAutodoDestroy()) {
                oldStore.doDestroy();
            }
            else {
                oldStore.byValue = oldStore.byText = Ext.destroy(oldStore.byValue, oldStore.byText);
            }
        }

        if (store) {
            store.on({
                scope: me,
                nodeexpand: me.onNodeExpand,
            });

        }


    },

    // onStoreLoad(store, records){
    //     let me = this,
    //         selection = me.getSelection();
    //     if(!selection) return;
    //     if(selection)
    //     // let find = store.findRecord(me.getValueField(), selection && selection[me.getValueField()], 0, false, false, true );
    //     // if(!find) return;
    //     // me.getPicker().setSelected(find);
    // },

    onNodeExpand(record, eOpts){
        let me = this,
            selection = me.getSelection();
        if(!selection) return;
        me.findValueNode(selection, record);
    },

    findValueNode(find, node){
        let me = this,
            id = find.id,
            code = find.code;
        node.eachChild(n=>{
            if(!code.startsWith(n.get('code'))) return true;
            if(id === n.getId()){
                me.getPicker().getSelectable().select(n);
            }else{
                if(n.isExpanded()) {
                    me.findValueNode(find, n);
                }else{
                    n.expand();
                }
            }
        })
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
    }



})