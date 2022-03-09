Ext.define('Common.shared.ux.panel.Header',{
    extend: 'Ext.panel.Header',
    xtype: 'uxpanelheader',

    requires:[
        'Ext.menu.Menu',
        'Ext.menu.RadioItem',
        'Common.shared.ux.button.Back',
        'Common.shared.ux.button.Trash',
        'Common.shared.ux.button.Search',
        'Common.shared.ux.button.Create',
        'Common.shared.ux.button.Done',
        'Common.shared.ux.button.Reset',
        'Common.shared.ux.button.Save',
        'Common.shared.ux.button.SaveAndNew',        
    ],

    padding: 0,
    layout: 'hbox',
    //hasSelectMenu: true,
    //hasUpdateMenu: false,
    //hasDeleteMenu: false,
    config:{
        buttons: null,
        sortMenus: null,

        standardButtons:{
            crate:   { xtype: 'uxcreatebutton', isCrud: true, crudName: 'create' },
            trash:   { xtype: 'uxtrashbutton', isCrud: true, crudName: 'delete' },
            search:  { xtype: 'uxsearchbutton' },
            done:    { xtype: 'uxdonebutton'},
            reset:   { xtype: 'uxresetbutton'},
            saveAndNew:   { xtype: 'uxsaveandnewbutton'},
            save:   { xtype: 'uxsavebutton'},             
            // error: { xtype: 'uxerrorbutton' },
            // success:{ xtype: 'uxsuccessbutton'},
            message: { xtype: 'uxmessagebutton'},
        },
        buttonDefaults:{
            //margin: '0 0 0 16px',
            arrow: false,
        },
        standardMenus: {
            // update:   { iconCls: 'md-icon-edit', langText: 'Edit', disabled: true, handler: 'onUpdate', permission: 'Update', isCrud: true, crudName: 'update' },
            // delete: { iconCls: 'md-icon-clear', langText: 'Delete', handler: 'onDelete', permission: 'Delete' , isCrud: true, crudName: 'delete'},
            // selectAll: {iconCls: 'md-icon-check-circle', langText: 'SelectAll', handler: 'onSelectAll'},
            // singleSelect : { iconCls: 'md-icon-radio-button-checked', langText: 'SingleSelect', handler: 'onSwitchSelectMode' ,value: 'single', group: 'selectMode', xtype: 'menuradioitem', checked: true },
            // multiSelect : { iconCls: 'md-icon-check-box', langText: 'MultiSelect', handler: 'onSwitchSelectMode' ,value: 'multi', group: 'selectMode', xtype: 'menuradioitem' }
        },
        menus: null,

        moreButton:{
            xtype: 'button',
            ui: 'plain',
            itemId: 'moreButton',
            iconCls : 'md-icon-more-horiz', 
            handler: null , 
            arrow: false,
            weight : 1000
        },

        backButton:{
            xtype: 'uxbackbutton'
        },
    },

    createComponent(newCmp) {
        return Ext.apply({
            ownerCmp: this
        }, newCmp);
    },

    createBackButton(newCmp){
        let me = this;
        return Ext.apply({
            ownerCmp: this,
            handler: me.onBack,
            scopeL: me
        }, newCmp);
    },

    applyBackButton(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createBackButton');
    },


    applyMoreButton(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyButtons(config, oldButtons) {
        let me = this,
            buttonDefaults = me.getButtonDefaults(),
            standardButtons = me.getStandardButtons(),
            buttons = [];

        if(!Ext.isObject(config)){
            Ext.raise('The buttons definition must be an object.');
        }


        Ext.Object.each(config,(key,value)=>{
            let button;
            if(value === false) return;
            if(Ext.isString(value)){
                button =Ext.apply({ handler: value}, buttonDefaults);
            }else if(value === true){
                button = {};
            }else{
                button = Ext.apply({}, buttonDefaults , value);
            }
            if(standardButtons[key]) button = Ext.applyIf(button, standardButtons[key]);       
            buttons.push(button);

        })

        return buttons;
    },

    /**
     * 应用排序菜单
     * @param {新排序菜单配置项} config 
     * @param {旧排序菜单} oldSortMenus 
     */
    applySortMenus(config, oldSortMenus){
        let me = this,
            menus = [];

        if(!Ext.isArray(config)){
            Ext.raise('The menus definition must be an object.');
        }

        config.forEach(m=>{
            if(!Ext.isString(m)) return;
            menus.push(me.getSortMenuItem(m,'ASC'));
            menus.push(me.getSortMenuItem(m,'DESC'));
        });

        return menus;

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
            panel = me.up(),
            resourceName = panel.resourceName || panel.getViewModel().get('resourceName'),
            value = `${field}-${dir}`,
            iconCls = dir === 'ASC' ? 'up': 'down';
        return { 
            text: I18N.get(field, resourceName), 
            value: value, 
            ui: 'dark',            
            iconCls: `x-fa fa-sort-alpha-${iconCls}`,
            //checked: defaultValue === value,
            hideOnClick: true,
            handler: 'onSort',            
            group: 'sortGroup' 
        };
    },


    initialize(){
        let me = this;
        me.callParent();

        me.add(me.getBackButton());

        let buttons = me.getButtons();

        if(buttons && buttons.length >0){
            me.add(buttons);
        }

        let menus = me.getMenus() || [],
            sortMenus = me.getSortMenus()
            moreButton = me.getMoreButton();
            //standardMenus = me.getStandardMenus();

        // console.log(me.getStandardMenus());

        // if(me.hasUpdateMenu){
        //     menus.push(Ext.apply({}, standardMenus.update));
        // }
            
        // if(me.hasDeleteMenu){
        //     menus.push(Ext.apply({}, standardMenus.delete));
        // }


        // if(me.hasSelectMenu){
        //     if(menus.length>0) menus.push({ xtype: 'menuseparator'});
        //     menus.push(Ext.apply({}, standardMenus.singleSelect));
        //     menus.push(Ext.apply({}, standardMenus.multiSelect));
        //     menus.push(Ext.apply({}, standardMenus.selectAll));
        // }
    
        
        if(sortMenus && sortMenus.length>0){
            if(menus.length>0) menus.push({ xtype: 'menuseparator'});
            menus = menus.concat(sortMenus);
        }

        if(menus.length>0){
            let moreButton = me.add(me.getMoreButton());
            moreButton.setMenu({
                xtype: 'menu',
                ui: 'dark',
                items: menus
            })
        }

        let view = me.up();
        if(view) view.on('hiddenchange', me.onViewHiddenChange, me);
    },

    onBack(){
        let me = this,
            view = me.up();
        view.hide();
        if(view && view.onBack){
            view.onBack();
            return;
        }

        if(view && view.getController){
            let controller = view.getController();
            if(controller && controller.onBack){
                controller.onBack();
                return;
            };
        }

        Ext.History.back();

    },

    onViewHiddenChange(sender, value){
        this.setHidden(value);
    }
 
})