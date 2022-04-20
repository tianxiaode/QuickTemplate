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

    getCheckActionHtml(record , action){
        let field = action.field,
            text = action.text || field,
            value = record.get(field),
            color = action.color,
            checkCls = value && Format.checkCls,
            resourceName = this.getResourceName();
        text = I18N.get(text, resourceName);
        return `<div class="flex-fill text-left ">
            <div class="x-checkcell ${color} ${checkCls}"  >
                <span class="x-checkbox-el x-font-icon" data-field='${field}'></span><span class="">${text}</span>
            </div>                        
        </div>`;
    },

    getIconActionHtml(record , action){
        return `<div class="flex-fill text-center">
                <span class="${action.cls}" data-id="${record.getId()}"></span>
            </div>
        `
    },

    getEmptyActionHtml(){
        return `<div class=flex-fill></div>`
    },

    getEditActionHtml(record){
        return this.getIconActionHtml(record, { cls: 'x-fa fa-edit text-primary' })
    },

    getMoreActionHtml(record){
        return this.getIconActionHtml(record, { cls: 'x-fa fa-ellipsis-h text-primary'});
    },


    onLocalized(){
        let me = this;
        me.callParent();
        me.updateRecord(me.getRecord());
    },

    updateItem(){},

    actions: null,
    updateItemAction(record){
        let me = this,
            actions = me.actions,
            html = [`<div class="d-flex py-1">`];
        if(!Ext.isArray(actions)) return;
        actions.forEach(a=>{
            a === '-' && html.push(me.getEmptyActionHtml());
            a === '.' && html.push(me.getMoreActionHtml(record));
            a === 'edit' && me.getPermissions().update &&  html.push(me.getEditActionHtml(record));
            a && a.type === 'bool' && html.push(me.getCheckActionHtml(record, a));
            a && a.type === 'icon' && html.push(me.getIconActionHtml(record, a));
            if(a.type !== 'bool' && a.type !== 'icon'){
                let fnName = `get${Format.capitalize(a.type)}ActionHtml`
                me[fnName] && html.push(me[fnName].apply(me, [record, a]));
            }
        })
        html.push('</div>')    
        me.actionElement.setHtml(html.join(''));

    },


});