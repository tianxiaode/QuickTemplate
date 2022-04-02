Ext.define('Common.mixin.component.More', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Ext.menu.Separator'
    ],

    config: {
        moreMenus:[],
        moreButton: {
            xtype: 'button',
            arrow: false,
            iconCls: 'md-icon-more-horiz',
            weight: 600,
            ui: 'plain',
            menu:{
                ui: 'dark',
                includeResource: true,
                anchor: true,
                defaults:{ ui: 'dark'}
            }
        },
    },

    hasMore: true,

    createMoreButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            handler: this.onSwitchSearchPanel
        }, newCmp);
    },

    applyMoreButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createMoreButton');
    },

    initialize(){
        let me = this,
            container = me.getMixinContainer(),
            button = me.getMoreButton();
        if(!me.isPhone()) return;
        container && container.add(button);
        me.addMoreMenus();
        me.addSortMenus();
    },

    addMoreMenus(){
        let me = this,
            menu = me.getMoreButton().getMenu()
            menus = me.getMoreMenus();
        menu.entityName = me.getEntityName();
        menus.length> 0 && menu.add(me.getMoreMenus());
    },


    /**
     * 应用排序菜单
     * @param {新排序菜单配置项} config 
     * @param {旧排序菜单} oldSortMenus 
     */
    addSortMenus(){
        let me = this,
            button = me.getMoreButton(),
            menu = button.getMenu(),
            sortFields = me.getSortFields(),
            menus = [];
        sortFields.forEach(m=>{
            if(!Ext.isString(m)) return;
            menus.push(me.getSortMenuItem(m,'ASC'));
            menus.push(me.getSortMenuItem(m,'DESC'));
        });

        if(menu.getItems().items.length>0) menu.add({xtype: 'menuseparator'})

        button.getMenu().add(menus);

    },

    /**
     * 构建菜单项
     * @param {菜单文本} field 
     * @param {排序方向}} dir 
     * @param {默认值} defaultValue 
     * @param {回调函数}} handler 
     */
    getSortMenuItem(field,dir){
        let me = this,
            value = `${field}-${dir}`,
            iconCls = dir === 'ASC' ? 'up': 'down';
        return { 
            langText: field, 
            value: value, 
            ui: 'dark',
            iconCls: `x-fa fa-sort-alpha-${iconCls}`,
            //checked: defaultValue === value,
            hideOnClick: true,
            handler: me.onSort,
            scope: me,
            group: 'sortGroup' 
        };
    },

    getSortStore(){
        let me = this,
            vm = me.getViewModel();
        return (me.getStore && me.getStore()) || ( vm && vm.getStore('mainStore'));
    },

    getSortFields(){
        return this.getSortStore().sortFields;
    },

    onSort(sender){
        let me = this,
            value = sender.getValue();
        if(me.currentSortField === value) return;
        me.currentSortField = value;
        let index =  value.indexOf('-'),
            field = value.substr(0,index),
            dir = value.substr(index+1),
            store = me.getSortStore();
        store.sort(field, dir);
    },

})
