Ext.define('Common.ux.dataview.ListItem', {
    extend: 'Ext.Component',
    xtype: 'uxlistitem',
 
    userCls: 'p-1 border-bottom',
    inheritUi: true,
    classCls: Ext.baseCSSPrefix + 'listitem',
    template: [
        {
            reference: 'itemElement',
        },
        {
            reference: 'actionElement'
        }                
    ],

 
    updateRecord(record) {
        if(!record) return;
        let me = this;
        me.updateItem(record);
        me.updateItemAction(record);
    },

    getHighlightValue(value){
        if(Ext.isEmpty(value)) return I18N.get('None');
        let store = this.getRecord().store,
            proxy = store.getProxy(),
            params = proxy.extraParams,
            filter = params.filter;
        if(Ext.isEmpty(filter)) return value;
        return value.toString().replace(new RegExp('(' + filter + ')', "gi"), '<span class="text-danger">$1</span>');
    },

    getCheckActionHtml(value, color, field, text){
        let checkCls = value && Format.checkCls,
            resourceName = this.getResourceName();
        text = I18N.get(text, resourceName);
        return `<div class="flex-fill text-left ">
            <div class="x-checkcell ${color} ${checkCls}" data-field='${field}' >
                <div class="x-checkbox-el x-font-icon" ></div>${text}
            </div>                        
        </div>`;
    },

    getItemActionTpl(){
        let html = [`<div class="d-flex">`];
        for (let i = 0; i < 5; i++) {
            html.push(`<div class=flex-fill text-left></div>`);
        }
        html.push(`</div>`);
        return html;
    },

    onLocalized(){
        let me = this;
        me.callParent();
        me.updateRecord(me.getRecord());
    },

    updateItem(){},

    updateItemAction(){},


});