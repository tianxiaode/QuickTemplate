Ext.define('Common.ux.crud.container.Base',{
    extend: 'Ext.Container',
    xtype: 'uxcrudcontainer',

    isCrudPanel: true,

    mixins:[
        'Common.mixin.component.Crud',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.SearchField',
        'Common.mixin.component.Back',
        'Common.mixin.component.More',
        'Common.ux.crud.container.mixin.Phone',
    ],

    config:{
        toolbar:{
            xtype: 'toolbar',
            isCrudToolbar: true,
            weighted: true,
            shadow: false,
            weight: 10,
        },
    },

    layout: 'vbox',
    weighted: true,

    defaultResponsive:{
        phone:{
            searchFieldMixinContainer: 'self',
            searchFieldUi: 'search',
            hasUpdate: false,
            hasRefresh: false,
        
            toolbarUi: 'dark',
            backMixinContainer: '[isCrudToolbar]',        
        },
        more:{
            hasMore: false,
            hasBack: false,            
            toolbarUi: 'dark',
            backMixinContainer: '[isCrudToolbar]',        
        }
    },


    createToolbar(newCmp) {
        let me = this,
            isPhone = me.isPhone();
        return Ext.apply({
            ownerCmp: this,
            ui: (isPhone && 'dark') || 'grid'
        }, newCmp);
    },

    applyToolbar(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createToolbar');
    },

    updateToolbar(config){
        if(config) this.add(config);
        this.onLocalized();
    },

    beforeInitialize(config){
        let me = this,
            isPhone = me.isPhone(),
            defaults = me.defaultResponsive,
            responsive = me.responsive;
        if(Ext.isObject(responsive)){
            Ext.apply(me, responsive);
            return;
        }
        if(Ext.isString(responsive)){
            let cfg = defaults[responsive];
            cfg && Ext.apply(me, cfg);
            return;
        }
        isPhone && Ext.apply(me, defaults.phone);
        !isPhone && Ext.apply(me, defaults.desktop);
        me.callParent(arguments);
    },

})