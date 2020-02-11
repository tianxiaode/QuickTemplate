/**
 * 枚举类
 * 通过EnumsStore来加载枚举数据，之后可将这些数据应用到下拉列表框
 */
Ext.define('Common.Shared.util.Enums', {
    alternateClassName: 'Enums',
    singleton: true,

    request:[
        'Common.Data.Store.Enums',
        'Common.Shared.util.Url'
    ],

    isReady: false,
    init(){
        let me = this,
            store = me.getStore();
        store.getProxy().setUrl(URI.get('Configuration', 'GetAllEnum'));
        store.on('load', me.onStoreLoad, me);
        store.load();
    },

    getStore(){
        return Ext.StoreMgr.lookup('EnumsStore');
    },

    /**
     * 加载枚举数据     * 
     * @param {*} store 
     * @param {*} records 
     * @param {*} successful 
     * @param {*} operation 
     * @param {*} eOpts 
     */
    onStoreLoad(store, records, successful, operation, eOpts ){
        let me = this;
        if(!successful) return;
        //将枚举数据转换为可直接访问的数据，用于枚举判断，如：
        //if(userType === Enums.UserType.Registered.value){ return  Enums.UserType.Registered.text}
        records.forEach(record => {
            let type = record.get('type'),
                data = me[type];
            if(!data){
                data = me[type] = {};
            }
            data[record.get('key')] = Ext.clone(record.data);
        });
        me.isReady = true;
        //出发枚举值已准备好事件
        Ext.fireEvent('enumsready');
    },


});
