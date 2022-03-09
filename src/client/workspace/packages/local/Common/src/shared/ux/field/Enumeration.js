Ext.define('Common.shared.ux.field.Enumeration',{
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
            valueField = isIntValue ? 'value' : 'textValue',
            defaultOption;
        if(Ext.isEmpty(name)) return;
        let values = Enums[name],
            options = [];
        if(Ext.isEmpty(values)) return;
        Object.keys(values).forEach(key=>{
            let item = values[key];
            resourceName = item.resourceName ;
            let option = {value: item[valueField], text: I18N.get(item.text, resourceName) , id: item.id};
            if(item.isDefault) defaultOption = option;
            options.push(option);
        });
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
        me.getPicker().setZIndex(1000);
    },


})
