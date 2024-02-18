Ext.define('Common.ux.toolbar.Action', {
    extend: 'Ext.Toolbar',
    xtype: 'uxactiontoolbar',

    mixins: [
        'Common.mixin.component.Crud',
        'Common.mixin.component.CountMessage',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.field.Search'
    ],

    weighted: true,
    shadow: false,
    userCls: 'bg-content',
    isCrudToolbar: true,
    
    /**
     * 更新CRUD按钮状态
     */
    refreshButtons(allowUpdate ,allowDelete){
        let me = this;
        me.setButtonDisabled('update', !allowUpdate);
        me.setButtonDisabled('delete', !allowDelete);
    },

    /**
     * 初始化CRUD按钮的显示
     */
    initButtons(permissions){
        let me = this;
        me.setButtonHidden('create', !permissions.create);
        me.setButtonHidden('update', !permissions.update);
        me.setButtonHidden('delete', !permissions.delete);
    },

    doDestroy() {
        this.destroyMembers('buttons');
    },

    privates:{
        getButtons() {
            let me = this,
                buttons = me.buttons;
            if (!buttons) {
                buttons = me.query('[isCrud]');
                me.buttons = {};
                buttons.forEach(b => {
                    me.buttons[b.crudName] = b;
                });
            }
            Logger.debug(me.getButtons, me.buttons)
            return me.buttons;
        },
    
        /**
         * 获取按钮
         * @param {按钮的key} key 
         */
        getButton(key) {
            let buttons = this.getButtons();
            return buttons[key];
        },


        setButtonHidden(key, hidden){
            let button = this.getButton(key) ;
            button && button.setHidden(hidden);
        },
    
        setButtonDisabled(key, disabled){
            let button = this.getButton(key) ;
            button && button.setDisabled(disabled);
        }       
    
    }


})
