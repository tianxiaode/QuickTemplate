Ext.define('Common.ux.app.ViewController', {
    extend: 'Ext.app.ViewController',

    /**
     * 获取视图模型指定键的值
     * @param {键} key 
     */
    getViewModelValue(key) {
        let vm = this.getViewModel();
        return vm && vm.get(key);
    },

    /**
     * 从视图模型获取指定键的值
     * @param {键} key 
     * @param {值} value 
     */
    setViewModelValue(key, value) {
        let vm = this.getViewModel();
        vm && vm.set(key, value);
    }

    

})