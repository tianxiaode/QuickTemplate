Ext.define('Common.ux.button.Option',{
    extend: 'Ext.Button',
    xtype: 'uxoptionbutton',

    config:{
        options: null,
        multiSelect: false,
    },

    arrow: false,
    menuAlign: 'b-t',
    isInitOptions: false,

    updateOptions(data){
        if(!data) return;
        let me = this,
            multi = me.getMultiSelect(),
            items = [],
            itemType = multi ? 'menucheckitem' : 'menuradioitem';        
        if(!Ext.isArray(data)) Ext.raise('按钮菜单数组必须是数组');
        me.isInitOptions = false;
        me.setMenu(null);
        Ext.each(data, d=>{
            let item = d;
            if(Ext.isString(d) || Ext.isNumeric(d)){
                item = { langText: d.toString(), value: d}
            }
            item.xtype = itemType;
            if(!multi) item.group = 'option';
            items.push(item);
        })
        me.setMenu({
            anchor: true,
            items: items
        });
        me.initItemEvents();
        me.isInitOptions = true;
        me.updateValue(me.getValue());
    },

    updateValue(value){
        let me = this;
        if(!me.isInitOptions) return;
        if(!value) return;
        if(!Ext.isArray(value)) value = [value];
        if(me.getMultiSelect()){
            me.clearAllSelect();
        }
        Ext.each(value, v=>{
            let item = me.getMenu().down(`[value=${v}]`);
            item.suspendEvents();
            item.setChecked(true);
            item.resumeEvents();
        })

    },

    clearAllSelect(){
        let items = this.getMenu().getItems().items;
        Ext.each(items, item=>{
           item.suspendEvents();
           item.setChecked(false);
           item.resumeEvents();
        })
    },

    initItemEvents(){
        let me = this,
            items = me.getMenu().getItems().items,
            itemListeners = [];
        Ext.each(items, item=>{
            itemListeners.push(item.on({
                checkchange: me.onItemCheckChange,
                scope: me,
                destroyable: true
            }))
        })
    },

    onItemCheckChange(sender, checked){
        let me = this,
            value = sender.getValue();
        if(!me.getMultiSelect() && !checked) return;
        if(me.getMultiSelect()){
           value = me.getAllCheckValue();
        }
        me.setValue(value);
        me.setText(Ext.isArray(value) ? value.join(',') : value);
        me.fireEvent('change', me, value );
    },

    getAllCheckValue(){
        let me = this,
            items = me.getMenu().getItems().items,
            value = [];
        Ext.each(items, i=>{
            if(i.getChecked()) value.push(i.getValue());
        })
        return value;
    },

    doDestroy(){
        Ext.each(this.itemListeners, l=>{
            Ext.destroy(l);
        })
        this.destroyMembers('options', 'value');
    }

})