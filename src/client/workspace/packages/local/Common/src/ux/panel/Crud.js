extExt.define('Common.ux.panel.Crud',{
    extend: 'Ext.Container',
    xtype: 'uxcrudpanel',

    mixins:[
        'Common.ux.crud.container.mixin.Grid',
        'Common.ux.crud.container.mixin.List',
        'Common.ux.crud.container.mixin.Tree',
        'Common.ux.toolbar.Paging',
        'Common.ux.toolbar.Crud'
    ],

    layout: 'vbox',
    weight: true,

    config:{
        crudToolbar: {},
        container: null,
        paging: null
    },

    createCrudToolbar(config){
        return Ext.apply({
            xtype: 'uxcrudtoolbar',
            weight: 100,
            ownerCmp: this,
        }, config);
    },

    applyCrudToolbar(config, old){
        return Ext.updateWidget(old, config, this, 'createCrudToolbar');
    },

    updateCrudToolbar(config){
        config && this.add(config);
    },

    createContainer(config){
        return Ext.apply({
            xtype: 'container',
            layout: 'hbox',
            weight: 200,
            ownerCmp: this,
        }, config);
    },

    applyContainer(config, old){
        return Ext.updateWidget(old, config, this, 'createContainer');
    },

    updateContainer(config){
        config && this.add(config);
    },

    createPaging(config){
        return Ext.apply({
            xtype: 'uxpagingtoolbar',
            weight: 300,
            ownerCmp: this,
      })
    },

    applyPaging(config, old){
        return Ext.updateWidget(old, config, this, 'createPaging');
    },

    updatePaging(config){
        config && this.add(config);
    },

    onLocalized(){
        let me = this,
            isPhone = me.isPhone(),
            isMore = me.responsive === 'more',
            title= me.getTitle() || (isPhone && !isMore && me.getEntityName());
        me.callParent();
        if(!title) return;
        me.getToolbar().setTitle({
            title: I18N.get(title, me.getResourceName()),
            centered: null,
            userCls: 'lh-36',
            flex: 1,
            weight: 0
        });
    },


    doDestroy(){
        let me = this;
        me.destroyMembers('crudToolbar', 'container', 'paging');

        me.callParent();
    }

})