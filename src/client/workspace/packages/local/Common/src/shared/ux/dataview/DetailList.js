Ext.define('Common.shared.ux.dataview.DetailList',{
    extend: 'Ext.dataview.List',
    xtype: 'uxdetaillist',

    requires:[
        'Common.data.store.Details',
    ],

    flex: 1,
    rowLines: true,
    striped: false,
    userCls: 'listing', 

    itemTpl:`
        <div class="row  px-2 py-3 border-bottom">                
            <div class="col-4 pl-0 h6 m-0 text-dark" >{label}</div>
            <div class="col-8 pr-0 pl-0 h6 m-0 black-54 text-right x-editable {cls}" data-id="{id}" >{text}</div>
        </div>

    `,

    store:{
        type: 'details'
    },

    config:{
        fields: []
    },

    applyFields(fields){
        let store = this.getStore(),
            data = [];
        Ext.each(fields,f=>{
            data.push({ id: f, label: I18N.get(f, this.up().resourceName), cls: '', value: null, text: null});
        });
        store.loadData(data);
        return fields;
    }
   
})