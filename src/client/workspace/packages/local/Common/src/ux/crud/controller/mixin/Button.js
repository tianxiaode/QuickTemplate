Ext.define('Common.ux.crud.controller.mixin.Button',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            updateCrudButtonState: 'updateCrudButtonState',
            initCrudButtonHiddenState: 'initCrudButtonHiddenState'
        }
    },

    crudButtons: null,  //所有crud按钮

    /**
     * 验证权限
     * @param {权限} permission 
     */
    isGranted(permission){
        let me = this,
            entityName = me.entityName,
            group = `${me.permissionGroup || entityName}.${ me.permissionName || Format.pluralize(entityName) }`;
        return ACL.isGranted(`${group}.${Ext.String.capitalize(permission)}`);
    },

    /**
     * 获取Crud按钮
     */
    getCrudButtons(){
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
    getCrudButton(key){
        let buttons  = this.getCrudButtons();
        return buttons[key];
    },

    /**
     * 禁用/启用按钮
     * @param {按钮的key} key 
     * @param {是否禁用} isDisabled
     * @param {状态值} state 
     */
    setCrudButton(key,isDisabled, state){
        let button = this.getCrudButton(key) ;
        button && isDisabled && button.setDisabled(state);
        button && !isDisabled && button.setHidden(state);
    },

    /**
     * 更新CRUD按钮状态
     */
    updateCrudButtonState(){
        let me = this,            
            selections = me.selections,
            hasSelected = selections.length > 0,
            allowUpdate = hasSelected ,
            allowDelete = hasSelected ;        
        if(me.allowUpdate) allowUpdate = allowUpdate && me.allowUpdate(selections);
        if(me.allowDelete) allowDelete = allowDelete && me.allowDelete(selections);
        me.setCrudButton('update', true, !allowUpdate);
        me.setCrudButton('delete', true, !allowDelete);
        me.customCrudButtonState(me, hasSelected, allowUpdate, allowDelete);
    },

    /**
     * 初始化CRUD按钮的显示
     */
    initCrudButtonHiddenState(){
        let me = this,
            permissions = me.permissions;
        me.setCrudButton('create', false, !me.isGranted(permissions.create));
        me.setCrudButton('update', false, !me.isGranted(permissions.update));
        me.setCrudButton('delete', false, !me.isGranted(permissions.delete));
    },
    
})
