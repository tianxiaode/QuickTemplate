Ext.define('Common.ux.crud.controller.mixin.Button',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            destroy: 'destroy',
            initButtons: 'initButtons',
            updateButtons: 'updateButtons'
        },
        after:{
            onStoreChange: 'onStoreChange'
        }

    },

    buttons: null,  //所有crud按钮

    onStoreChange(){
        this.initButtons();
    },


    /**
     * 获取Crud按钮
     */
    getButtons(){
        let me = this,
            view = me.getView(),
            crudButtons = me.crudButtons;
        if(crudButtons) return crudButtons;
        let buttons = view.query('[isCrud]');
        crudButtons = {};
        buttons.forEach(f=>{
            crudButtons[f.crudName] = f;
        });
        me.crudButtons = crudButtons;
        return crudButtons;
    },

    /**
     * 获取按钮
     * @param {按钮的key} key 
     */
    getButton(key){
        let buttons  = this.getButtons();
        return buttons[key];
    },

    /**
     * 更新CRUD按钮状态
     */
    updateButtons(){
        let me = this,            
            hasSelected = me.hasSelections(false),
            allowUpdate = me.allowUpdate(hasSelected) ,
            allowDelete = me.allowDelete(hasSelected) ;
        me.setButtonDisabled('update', !allowUpdate);
        me.setButtonDisabled('delete', !allowDelete);
    },

    allowUpdate(hasSelected){
        return hasSelected;
    },

    allowDelete(hasSelected){
        return hasSelected;
    },

    /**
     * 初始化CRUD按钮的显示
     */
    initButtons(){
        let me = this,
            permissions = me.permissions;
        me.setButtonHidden('create', !permissions.create);
        me.setButtonHidden('update', !permissions.update);
        me.setButtonHidden('delete', !permissions.delete);
    },

    setButtonHidden(key, hidden){
        let button = this.getButton(key) ;
        button && button.setHidden(hidden);
    },

    setButtonDisabled(key, disabled){
        let button = this.getButton(key) ;
        button && button.setDisabled(disabled);
    },

    destroy(){
        this.buttons = null;
    }
    
})
