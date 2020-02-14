Ext.define('Common.Desktop.mixin.grid.ButtonState', {
    mixinId: 'buttonactionmixin',

    /**
     * 根据键值获取按钮
     * @param {按钮键值}} key 
     */
    getButtonByKey(key){
        let buttons = this.getView()._buttons || this.getView().getButtons() ;
        return buttons.getItems().getByKey(key);
    },


    /**
     * 根据键值设置按钮禁用状态
     * @param {按钮键值}} key 
     * @param {禁用} disabled 
     */
    setButtonDisabled(key,disabled){
        let button = this.getButtonByKey(key) ;
        if(button) button.setDisabled(disabled);
    },

    /**
     * 根据键值设置按钮显示状态
     * @param {按钮键值} key 
     * @param {隐藏} hidden 
     */
    setButtonHidden(key,hidden){
        let button = this.getButtonByKey(key);
        if(button) button.setHidden(hidden);
    },

    /**
     * 初始化CRUD按钮状态
     */
    initCrudButtonHiddenState(){
        let me = this,
            entityName = me.getEntityName();
        me.setButtonHidden('create', !ACL.isGranted('Pages.'+ entityName + '.Create'));
        me.setButtonHidden('edit', !ACL.isGranted('Pages.'+ entityName + '.Edit'));
        me.setButtonHidden('delete', !ACL.isGranted('Pages.'+ entityName + '.Delete'));
    },

    /**
     * 验证编辑按钮状态
     * @param {选择} selections 
     */
    editButtonStateValidation(selections){
        if(selections.length <= 0) return true;
        return false;
    },

    /**
     * 验证删除按钮状态
     * @param {选择} selections 
     */
    deleteButtonStateValidation(selections){
        if(selections.length <= 0) return true;
        return false;
    },

    //编辑按钮状态的附加验证
    additionalEditButtonStateValidation(){return false},
    //删除按钮状态的附加验证
    additionalDeleteButtonStateValidation(){return false},

    /**
     * 更新CRUD按钮状态
     */
    updateCrudButtonState(){
        let me = this,
            selections = me.getCurrentSelections();
        me.setButtonDisabled('edit',  me.additionalEditButtonStateValidation(selections) || me.editButtonStateValidation(selections));
        me.setButtonDisabled('delete',me.additionalDeleteButtonStateValidation(selections) || me.deleteButtonStateValidation(selections));
    },

});