Ext.define('Common.mixin.crud.Button', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before: {
            doDestroy: 'doDestroy'
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
    initButtons(contianner, permissions) {
        let me = this;
        me.setCrudButtons(contianner.query('[isCrud]'));
        Logger.debug(me.initButtons, me.getCrudButtons());
        me.setButtonHidden('create', !permissions.create);
        me.setButtonHidden('update', !permissions.update);
        me.setButtonHidden('delete', !permissions.delete);
    },

    /**
     * 根据key获取按钮
     * @param {按钮的key} key 
     */
    getButton(key) { return this.getCrudButtons.get(key) },

    /**
     * 更新CRUD按钮状态
     */
    refresButtons(hasSelected) {
        let me = this,
            allowUpdate = me.allowUpdate(hasSelected),
            allowDelete = me.allowDelete(hasSelected);
        me.setButtonDisabled('update', !allowUpdate);
        me.setButtonDisabled('delete', !allowDelete);
    },

    /**
     * 处理是否允许编辑逻辑，可重写
     * @param {是否有选择} hasSelected 
     * @returns 
     */

    allowUpdate(hasSelected) {
        return hasSelected;
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
