Ext.define('Common.ux.field.Enumeration',{
    extend: 'Ext.field.Select',
    xtype: 'uxenumerationfield',

    config:{
        enumName: null,
        hasAllValue: true,
        autoSelected: true,
        filter: null,
        allValueText: null,
        isIntValue: true,
    },

    picker: 'floated',

    store:{
        sorters: 'order'
    },

    initialize(){
        let me = this;
        me.callParent();
        if(Enums.isReady){
            me.initSelectData();
            return;
        }
        Enums.on('ready', me.initSelectData, me, { single: true});
    },

    initSelectData(){
        let me = this,
            name = Format.uncapitalize(me.getEnumName()),
            resourceName =null,
            isIntValue = me.getIsIntValue(),            
            valueField = isIntValue ? 'value' : 'text',
            defaultOption;
        if(Ext.isEmpty(name)) return;
        let values = Enums[name],
            options = [];
        if(Ext.isEmpty(values)) return;
        Ext.iterate(values,(k,v)=>{
            resourceName = v.resourceName;
            let option = {value: v[valueField], langText: v.text , id: v.id, order: v.order};
            if(v.isDefault) defaultOption = option;
            options.push(option);
        })
        me.resourceName = resourceName;
        if(me.getHasAllValue()) {
            let text = I18N.get(me.getAllValueText(), resourceName) || `${I18N.get('All')}${I18N.get(Format.capitalize(name), resourceName)}`;
            options = [{value: isIntValue ? -1 : 'all', text: text}]
                .concat(options);
            defaultOption = options[0];
        };
        me.setOptions(options);
        let filter = me.getFilter();
        if(filter) me.getStore().filter(filter);
        if(me.getAutoSelected()) {
            me.suspendEvent('change');
            defaultOption && me.setValue(defaultOption.value);
            me.resumeEvent('change');
        }
        me.onLocalized();
        me.getPicker().setZIndex(1000);
    },

    onLocalized(){
        let me = this,
            store = me.getStore();
        me.callParent();
        store.each(r=>{
            let lang = r.get('langText')
            r.set('text', I18N.get(lang, me.resourceName));

        })
    }

})
