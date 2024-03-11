Ext.define('Common.mixin.crud.Button', {
    extend: 'Common.mixin.Base',

    mixinConfig: {
        configs:true,
        before:{
            doDestroy: 'doDestroy'
        },
        after: {
            onListSelect: 'refreshButtons',
            onListDeselect: 'refreshButtons'
        }
    },


    config: {
        crudButtons: null
    },

    /**
     * 将按钮数组转换位map
     * @param {按钮数组} buttons 
     * @returns 
     */
    applyCrudButtons(buttons) {
        if (!buttons) return;
        let me = this,
            map = new Map();
        Ext.each(buttons, b => {
            let name = b.crudName;
            map.set(name, b);
            b.setHandler(me[`on${Ext.String.capitalize(name)}ButtonTap`].bind(me));
        })
        return map;
    },

    /**
     * 初始化CRUD按钮的显示
     */
    initButtons(container, permissions) {
        let me = this;
        me.setCrudButtons(container.query('[isCrud]'));
        me.setButtonHidden('create', !permissions.create);
        me.setButtonHidden('update', !permissions.update);
        me.setButtonHidden('delete', !permissions.delete);
        me.refreshButtons(false);
    },

    /**
     * 根据key获取按钮
     * @param {按钮的key} key 
     */
    getButton(key) { return this.getCrudButtons().get(key) },

    /**
     * 更新CRUD按钮状态
     */
    refreshButtons() {
        let me = this,
            selections = me.getSelections(),
            hasSelected = selections.length > 0,
            allowUpdate = me.allowUpdate(),
            allowDelete = me.allowDelete(hasSelected);
        me.setButtonDisabled('update', !allowUpdate);
        me.setButtonDisabled('delete', !allowDelete);
    },

    /**
     * 处理是否允许编辑逻辑，可重写
     * @param {是否有选择} hasSelected 
     * @returns 
     */

    allowUpdate() {
        let selection = this.getSelection();
        if(selection){
            this.currentRecord = selection;
            return true;
        }
        return false;
    },

    /**
     * 处理是否允许删除逻辑，可重写
     * @param {是否有选择} hasSelected 
     * @returns 
     */

    allowDelete(hasSelected) {
        return hasSelected;
    },

    /**
     * 设置按钮隐藏状态
     * @param {按钮名称} key 
     * @param {是否隐藏} hidden 
     */

    setButtonHidden(key, hidden) {
        let button = this.getCrudButtons().get(key);
        button && button.setHidden(hidden);
    },

    /**
     * 设置按钮禁用状态
     * @param {按钮名称} key 
     * @param {是否禁用} disabled 
     */

    setButtonDisabled(key, disabled) {
        let button = this.getCrudButtons().get(key);
        button && button.setDisabled(disabled);
    },

    /**
     * 销毁
     */
    doDestroy() {
        this.setCrudButtons(null);
    }

})
