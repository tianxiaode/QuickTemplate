Ext.define('Common.ux.dataview.plugin.TextEditor',{
    extend: 'Common.ux.dataview.plugin.LabelEditor',
    alias: 'plugin.dataviewtexteditor',

    requires:[
        'Common.ux.field.plugin.More'
    ],

    labelSelector: 'x-editable-text',

    hasMore: false,

    applyField(config) {
        if(this.hasMore){
            Ext.apply(config, {
                plugins:[
                    {
                        type: 'fieldmore'
                    }
                ]
            })
        }
        return Ext.widget(config);
    },


})