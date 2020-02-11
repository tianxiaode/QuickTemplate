/**
 * 将键盘回车键事件混入视图控制器
 */
Ext.define('Common.Desktop.mixin.viewController.Keyboard', {
    mixinId: 'viewControllerKeyboard',

    /**
     * 按下回车键时切换字段
     * @param {事件} event 
     * @param {字段} field 
     */
    doEnterNextField: function (event, field) {
        var parent = field.up('component[autoTabIndex]'),
            index = field.getTabIndex() +1,
            next = parent.down('field[tabIndex='+index+']');
        if(next)next.focus();
        event.preventDefault();
        return false;
    },

    /**
     * 执行保存操作
     * @param {事件} event 
     */
    onEnterSave: function(event){
        this.onSave();
        event.preventDefault();
    }

});