/**
 * 自定义的搜索字段
 */
Ext.define('Common.Shared.ux.field.Search', {
    extend: 'Ext.field.Text',
    xtype: 'uxsearchfield',
 
    requires: [
        'Ext.field.trigger.Search'
    ],



    searchHandler: 'doSearch',

    triggers: {
        search: {
            type: 'search'
        }
    },
    
    placeholder: I18N.Search,
    //label: I18N.Search,
    minWidth: 200 , 
    keyMapEnabled: true,

    applyTriggers: function(triggers, oldTriggers) {
        var me = this,
            instances = oldTriggers || {},
            clearable = me.getClearable(),
            name, trigger, oldTrigger;

        for (name in triggers) {
            trigger = triggers[name];
            oldTrigger = instances[name];

            // Any key that exists on the incoming object should cause destruction of
            // the existing trigger for that key, if one exists.  This is true for both
            // truthy values (triggers and trigger configs) and falsy values. Falsy values
            // cause destruction of the existing trigger without replacement.
            if (oldTrigger) {
                oldTrigger.destroy();
            }
            if(name === 'search'){
                let prototype = Object.getPrototypeOf(trigger);
                prototype.handler = me.searchHandler;
            }

            if (trigger) {
                if (!clearable && (name === 'clear')) {
                    continue;
                }

                instances[name] = me.createTrigger(name, trigger);
            }
        }

        return instances;
    },

    initialize: function(){
        var me = this;
        me.setKeyMap({
            enter: { handler: me.searchHandler }
        });
        //me.getTriggers().clear.on('tap','doClearIconTap',me);
        me.callParent();
    },

    onClearIconTap: function(sender,input, e) {
        this.callParent(arguments);
        this.getTriggers().search.el.doFireEvent('tap',[e]);
        this.getTriggers().search.el.doFireEvent('click',[e]);
    }


});