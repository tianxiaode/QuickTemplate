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
        if(Ext.platformTags.phone){
            let ui = 'faded';
            if(me.up().xtype === 'uxcrudtoolbar') ui = 'solo';
            me.setUi(ui);
        }
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

    // onClearIconTap: function(sender,input, e) {
    //     this.callParent(arguments);
    //     this.getTriggers().search.el.doFireEvent('tap',[e]);
    //     this.getTriggers().search.el.doFireEvent('click',[e]);
    // }


});