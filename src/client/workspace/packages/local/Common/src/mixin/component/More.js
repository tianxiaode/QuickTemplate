Ext.define('Common.mixin.component.More', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Ext.menu.Separator',
        'Ext.menu.RadioItem'
    ],

    config: {
        moreMenus: [],
        moreButton: {}
    },

    createMoreButton(config) {
        return Ext.apply({
            xtype: 'button',
            arrow: false,
            iconCls: 'md-icon-more-horiz',
            weight: 600,
            ui: 'plain',
            menu:{
                ui: 'dark',
                scrollable: 'y',
                maxHeight: '80%',
                anchor: true,
                defaults:{ ui: 'dark'}
            },
            ownerCmp: this,
            handler: this.onSwitchSearchPanel
        }, config);
    },

    applyMoreButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createMoreButton');
    },

    updateMoreButton(config){
        let me = this;
        if(!config || !me.isPhone()) return;
        me.add(config);
        me.addMoreMenus();
        me.addSortMenus();
    },

    // initialize(){
    //     let me = this,
    //         container = me.getMixinContainer(),
    //         button = me.getMoreButton();
    //     if(!me.isPhone() || !me.hasMore) return;
    //     container && container.add(button);
    // },

    addMoreMenus(){
        let me = this,
            menu = me.getMoreButton().getMenu()
            menus = me.getMoreMenus();
        menu.entityName = me.getEntityName();
        menu.resourceName = me.getResourceName();
        menu.permissionGroup = me.permissionGroup;
        menu.permissionName = me.permissionName;
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
            store = me.getSortStore(),
            menu = button.getMenu(),
            sortFields = me.getSortFields(),
            langText = store.langText,
            defaultSorter = me.getDefaultSorter(),            
            menus = [];
        Ext.iterate(sortFields, (m, v)=>{
            if(!Ext.isString(m)) return;
            menus.push(me.getSortMenuItem(m,'ASC' , langText[m]));
            menus.push(me.getSortMenuItem(m,'DESC', langText[m]));
        });

        if(menu.getItems().items.length>0) menu.add({xtype: 'menuseparator'})


        menu.add(menus);

        let defaultMenu = menu.down(`[value='${defaultSorter}']`);
        defaultMenu && defaultMenu.setChecked(true);

    },

    /**
     * 构建菜单项
     * @param {菜单文本} field 
     * @param {排序方向}} dir 
     * @param {默认值} defaultValue 
     * @param {回调函数}} handler 
     */
    getSortMenuItem(field,dir, langText){
        let me = this,
            value = `${field}-${dir}`,
            iconCls = dir === 'ASC' ? 'up': 'down';
        return { 
            xtype: 'menuradioitem',
            langText: langText || field, 
            value: value, 
            ui: 'dark',
            iconCls: `x-fa fa-sort-alpha-${iconCls}`,
            hideOnClick: true,
            handler: me.onSort,
            scope: me,
            group: 'sortGroup' 
        };
    },
    

    getSortStore(){
        let me = this,
            vm = me.getViewModel(),
            list = me.down('[isCrudList]');
        return ( vm && vm.getStore('mainStore'))
            || (list && list.getStore())
            || (me.getStore && me.getStore());
    },

    getSortFields(){
        return this.getSortStore().sortFields;
    },

    getDefaultSorter(){
        let store = this.getSortStore(),
            sorter = store.getSorters().items[0];
        if(!sorter) return;
        let value = `${sorter._property}-${sorter._direction}`;
        this.currentSortField = value;
        return value;
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

    doDestroy(){
        this.setMoreMenus(null);
        this.setMoreButton(null);
    }

})
