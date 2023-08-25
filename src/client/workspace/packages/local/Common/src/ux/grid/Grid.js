Ext.define('Common.ux.grid.Grid',{
    extend: 'Ext.grid.Grid',
    xtype: 'uxgrid',

    requires:[
        'Ext.dataview.plugin.ListPaging',
        'Common.ux.grid.column.CheckChange'
    ],

    config:{
        grouped: false,
    },

    hasPaging: true,

    initialize() {
        let me = this;
 
        me.callParent();
        if(me.hasPaging){
            me.addPlugin({
                type: 'listpaging',
                autoPaging: true
            });
        }
    },

    privates:{
        updateStore(store){
            let me= this;
            me.callParent(arguments);
            if(!store) return;
            let columns = me.getColumns(),
                model = store.getModel(),
                map = model.fieldsMap;
            columns.forEach(c=>{
                let name = c.getDataIndex();
                if(!name) return;
                let f = map[name],
                    text = f.langText;
                if(!text) return;
                c.setLangText(text);
                c.setText(I18N.get(text, me.getResourceName()))
            })
        }    
    }
})

 