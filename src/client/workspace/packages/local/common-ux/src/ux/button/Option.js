Ext.define('Common.ux.button.Option',{
    extend: 'Ext.Button',
    xtype: 'uxoptionbutton',

    config:{
        options: null,
        multiSelect: false,
    },

    arrow: false,
    menuAlign: 'b-t',

    updateOptions(data){
        if(!data) return;
        let me = this,
            multi = me.getMultiSelect(),
            items = [],
            itemType = multi ? 'menucheckitem' : 'menuradioitem';
        if(!Ext.isArray(data)) Ext.raise('按钮菜单数组必须是数组');
        Ext.each(data, d=>{
            let item = d;
            if(Ext.isString(d) || Ext.isNumeric(d)){
                item = { langText: d.toString(), value: d}
            }
            item.itemType = itemType;
            if(!multi) item.group = 'option';
            items.push(item);
        })
        me.setMenu({
            items: items
        })
    },

    updateValue(value){
        let me = this;
        if(!Ext.isArray(value)) value = [value];
        if(me.getMultiSelect()){
            me.clearAllSelect();
        }
        Ext.each(value, v=>{
            let item = me.getMenu().down(`[value=${v}]`);
            item && item.setChecked(true);
        })

    },

    clearAllSelect(){
        let menu = me.getMenu();
        Ext.each(menu.getItems().items, i=>{
            i.setChecked(false);
        })
    },

    doDestroy(){
        this.setData(null);
    }

})