Ext.define('Common.shared.ux.dataview.EnumList',{
    extend: 'Ext.dataview.List',
    xtype: 'uxenumlist',

    config:{
        enumName: null,
        filter: null,
        isIntValue: true,        
    },

    minHeight: 200,

    store:{
        fields: ['id', 'value', 'text']
    },

    itemTpl: `<div class="p-2 text-truncate">{text}</div>`,

    initialize(){
        let me = this;
        me.callParent();
        if(Enums.isReady){
            me.initListData();
            return;
        }
        Enums.on('ready', me.initListData, me, { single: true});
    },

    initListData(){
        let me = this,
            name = Format.uncapitalize(me.getEnumName()),
            isIntValue = me.getIsIntValue(),            
            valueField = isIntValue ? 'value' : 'textValue',
            data = [];
        if(Ext.isEmpty(name)) return;
        let values = Enums[name];
        if(Ext.isEmpty(values)) return;
        Ext.iterate(values,(key, item)=>{
            data.push({value: item[valueField], text: item.text , id: item.id});
        })
        me.getStore().loadData(data);
        let filter = me.getFilter();
        if(filter) me.getStore().filter(filter);
    },

    updateFilter(filter){
        let store = this.getStore();
        if(!store) return;
        Ext.isFunction(filter) && store.filterBy(filter);
        !Ext.isFunction(filter) && store.filter(filter);
    }

})
