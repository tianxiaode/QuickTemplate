Ext.define('Common.ux.button.SegmentedOption',{
    extend: 'Ext.SegmentedButton',
    xtype: 'uxsegmentedoptionbutton',

    config:{
        options: null,
    },
    isInitOptions: false,

    updateOptions(data){
        if(!data) return;
        let me = this,
            items = [];        
        if(!Ext.isArray(data)) Ext.raise('选项必须是数组');
        me.isInitOptions = false;
        Ext.each(data, d=>{
            let item = d;
            if(Ext.isString(d) || Ext.isNumeric(d)){
                item = { langText: d.toString(), value: d, ui: 'action-segmented'}
            }
            items.push(item);
        })
        me.add(items);
        me.updateValue(me.getValue());
    },

    doDestroy(){
        this.destroyMembers('options', 'value');
    }

})