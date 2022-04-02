Ext.define('Common.ux.field.Search', {
    extend: 'Ext.field.Search',
    xtype: 'uxsearchfield',

    config:{
        searchHandler: 'onSearch',
        remote : true
    },

    langPlaceholder: 'Search',
    autoLabel: false,

    initialize: function(){
        let me = this;
        me.callParent();
        me.on('change', me.doTypeAhead, me);
    },

    doTypeAhead(){
        let me = this;

        if (!me.typeAheadTask) {
            me.typeAheadTask = new Ext.util.DelayedTask(me.onTypeAhead, me);
        }
 
        me.typeAheadTask.delay(me.getRemote() ? 500 : 10);
    },

    onTypeAhead(){
        let me = this,
            handlerName = me.getSearchHandler(),
            handler = me.findSearchHandler(me, handlerName);
        if(handler) handler.fn.call(handler.owner, me, me.getValue());
    },

    findSearchHandler(cmp, name){        
        let handler = cmp[name];
        if(handler) return { owner: cmp, fn: handler };
        let controller = cmp.getController();
        handler = controller && controller[name];
        if(handler) return { owner: controller, fn: handler };
        let parent = cmp.up();
        return parent ? this.findSearchHandler(parent, name) : null;
    },


});