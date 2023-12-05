Ext.define('Common.ux.dataview.ListItem', {
    extend: 'Ext.Component',
    xtype: 'uxlistitem',

    userCls: 'p-1 border-bottom',
    inheritUi: true,
    classCls: Ext.baseCSSPrefix + 'listitem',

    template: [
        {
            reference: 'bodyElement',
            cls: Ext.baseCSSPrefix + 'body-el p-0',
            uiCls: 'body-el',
            children: [
                {
                    reference: 'innerElement',
                    cls: Ext.baseCSSPrefix + 'inner-el p-0 d-block',
                    uiCls: 'inner-el',
                    children:[
                        {
                            reference: 'itemElement',
                        },
                        {
                            reference: 'actionElement',
                        }
                    ]
                }
            ]
        }
    ],

    updateRecord(record) {
        if(!record) return;
        let me = this;
        me.updateListItem(record);
        me.updateItemAction(record);
    },

    getHighlightValue(value, values, field){
        return Format.listHighlight.apply(this.parent, [value, values, field]);
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

    onLocalized(){
        let me = this;
        me.callParent();
        me.updateRecord(me.getRecord());
    },

    updateListItem(){},

    defaultActions:{
        
        '-'(){
            return `<div class=flex-fill></div>`
        },

        '.'(record){  
            return this.getIconActionHtml(record, { cls: 'x-fa fa-ellipsis-h text-primary'});
        },

        'edit'(record){
            return this.getIconActionHtml(record, { cls: 'x-fa fa-edit text-primary' })
        },

        'lang'(record){
            return this.getIconActionHtml(record, { cls: 'x-fa fa-globe text-primary'});
        },

        'bool'(record, action){
            return this.getCheckActionHtml(record, action);
        },

        'icon'(record, action){
            return this.getIconActionHtml(record, action.cls);
        }
    },

    actions: null,
    updateItemAction(record){
        let me = this,
            defaults = me.defaultActions,
            actions = me.actions,
            html = [`<div class="d-flex py-1">`];
        if(!Ext.isArray(actions)) return;
        actions.forEach(a=>{            
            if(Ext.isString(a)){
                let action = defaults[a];
                action && html.push(action.apply(me, [record]));
                return;
            }
            let type = a && a.type;
            if(type){
                let action = actions[type] || defaults[type];
                action && html.push(action.apply(me, [record, a]));
            }
        })
        html.push('</div>')    
        me.actionElement.setHtml(html.join(''));

    },

    doDestroy() {
        let me = this;
        me.destroyMembers('defaultActions', 'template', 'actions');
        me.callParent();
    }

});