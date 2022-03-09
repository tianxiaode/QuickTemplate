Ext.define('Common.shared.ux.field.Currency',{
    extend: 'Ext.field.ComboBox',
    xtype: 'currencyfield',

    requires:[
        //'Common.data.model.infrastructures.Currency',
    ],

    store:{
        model: 'Common.data.model.infrastructures.Currency',
        pageSize: 0
        //type: 'currencies',

        // autoLoad: true,
        // proxy:{
        //     type:'format',
        //     url: URI.crud('Currency', 'localizations')
        // }
    },

    displayField: 'displayName',
    displayTpl: `{displayName:translationItem(values, 'displayName')}`,
    valueField: 'code',
    editable: false,
    queryMode: 'local',
    picker: 'floated',
    forceSelection: true,
    matchFieldWidth: false,
    

    itemTpl: `
        <div class="row p-2 lh-20" style="width:200px;">
            <div class="col-6 pl-0 pr-1 text-truncate">{displayName:translationItem(values, 'displayName')}</div>
            <div class="col-3 pl-0 pr-1">{code}</div>
            <div class="col-3 pl-0 pr-0">{symbol}</div>
        </div>
    `,

    initialize(){
        let me = this;
        me.callParent();
        me.initData();
    },

    initData(){
        console.log(Config.getCurrencyList())
        this.getStore().loadData([].concat(Config.getCurrencyList()));
    }

    
})