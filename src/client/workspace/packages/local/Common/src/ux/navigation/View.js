Ext.define('Common.ux.navigation.Panel',{
    extend: 'Ext.Container',
    xtype: 'uxnavigationpanel',

    requires:[
        'Common.ux.navigation.Menu'
    ],

    layout: 'hbox',
    userCls: 'bg-transparent',

    config:{
        card1:{
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            margin: '0 0 0 10px'
        },
        navigation:{
            xtype: 'uxnavigationmenu',            
        },
    },


    createNavigation(newCmp) {
        let me = this;
        return Ext.apply({
            ownerCmp: me,
            listeners:{
                select: me.onNavigationSelect,
                scope: me
            }
        }, newCmp);
    },

    applyNavigation(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createNavigation');
    },

    updateNavigation(config){
        if(!config)  return;
        this.insert(0, config);
    },

    createCard1(newCmp){
        return Ext.apply({
            ownerCmp: this,
        })
    },

    applyCard1(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createCard');
    },

    updateCard1(config){
        if(!config)  return;
        this.insert(1, config);
    },

    onNavigationSelect(sender, selected, eOpts){
        this.onSwitchView(selected);
    },

    onSwitchView(selected){
        let me = this,
            container = me.getCard1(),
            xtype = selected.get('viewType'),
            widget = ViewMgr.getWidget(xtype),
            current = me.current;
        if(!widget) Ext.util.History.add('page404');
        xtype = widget.prototype.xtype;
        current && current.setHidden(true);
        console.log(container)
        let view = container.down(xtype);
        if(view) {
            view.setHidden(false);
            me.current = view;            
            return;
        }
        view = container.add({ xtype: xtype, flex: 1 });
        me.current = view;
    },

})