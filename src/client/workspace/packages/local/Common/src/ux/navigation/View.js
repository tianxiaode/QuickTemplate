Ext.define('Common.ux.navigation.View',{
    extend: 'Ext.Container',
    xtype: 'uxnavigationview',

    requires:[
        'Common.ux.navigation.Menu'
    ],

    layout: 'card',

    config:{
        navigation:{
            xtype: 'uxnavigationmenu',            
            docked: 'left',
        },

    },


    createNavigation(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyNavigation(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },


    initialize(){
        let me = this;
        me.callParent();
        let navigation = me.add(me.getNavigation());
        navigation.on('select', me.onSwitchView, me );
        me.initActiveItem(navigation);
    },

    initActiveItem(navigation){
        let me = this,
            selected = navigation.getSelection();
        if(selected) me.onSwitchView(navigation, selected);
    },

    onSwitchView(sender, selected, eOpts){
        let me = this,
            xtype = selected.get('viewType'),
            widget = ViewMgr.getWidget(xtype);
        if(!widget) Ext.util.History.add('page404');
        xtype = widget.prototype.xtype;
        let view = me.down(xtype);
        if(view) {
            me.setActiveItem(view);
            return;
        }
        view = me.add({ xtype: xtype });
        me.setActiveItem(view);
    }
})