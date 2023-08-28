Ext.define('Common.ux.field.plugin.History', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.fieldhistory',
 
    requires:[
        'Common.ux.field.trigger.History'
    ],

    config:{
        owner: null,        
        historyMenu:{
            lazy: true,
            $value: {
                xtype: 'menu',
                minWidth: 300,
                minHeight: 200,
                anchor: true,
            }
        }
    },

    applyHistoryMenu(newCmp, old ){
        return Ext.updateWidget(old, newCmp,
            this, 'createHistoryMenu');
    },

    createHistoryMenu(newCmp){
        return Ext.apply({
            ownerCmp: this.getOwner(),
        }, newCmp);
    },

    init(field) {
        let me = this;
        me.setOwner(field);

        field.addTrigger('history', {
            type: 'history',
            handler: me.onHistoryIconTap,
            scope: me,
            weight: 100
        })
        
    },
 
    onHistoryIconTap(sender, trigger, event){
        let me = this,
            menu = me.getHistoryMenu();
        menu.autoFocus = !event.pointerType;
        menu.showBy(trigger.el,  'tr-br?');
            
    },

    addHistory(value){
        let me = this,
            filed = me.getOwner(),
            menu = me.getHistoryMenu(),
            items = menu.getItems().items,
            valueField = filed.getValueField(),
            addValue = value[valueField],
            ln = items.length,
            needAdd = true;
        for(let i=0;i<ln; i++){
            let item = items[i],
                value = item.value,
                hasValue = value[valueField];
            if(addValue === hasValue) needAdd = false;
        }
        if(!needAdd ) return;
        if(ln === 10) menu.remove(items[0]);
        menu.add({
            xtype: 'menuitem',
            text: Format.getTranslationObjectText(value.isModel ? value.data : value),
            value: value,
            handler: me.onHistoryItemTap,
            scope: me
        });
    },

    onHistoryItemTap(sender){
        let value = sender.value;
        this.getOwner().setValue(value);
    },


    doDestroy() {
        let me = this;
        me.setOwner(null);
        me.cleanup();
        me.callParent();
    },
    
    privates:{
        cleanup(){
            var me = this,
                menu = me.getHistoryMenu();
 
            if (menu && !menu.destroyed) {
                menu.removeAll(false);
            }

        }
    }
});