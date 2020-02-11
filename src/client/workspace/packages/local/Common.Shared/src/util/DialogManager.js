/**
 * 用户创建并返回对话框
 */
Ext.define('Common.Shared.util.DialogManager', {
    alternateClassName: 'DialogManager',
    singleton: true,

    /**
     * 全局页面
     */
    globalPages:['login','forgotpassword' , 'resetpassword' , 'page404', 'page500', 'login'],

    /**
     * 用户记录已创建的对话框
     */
    dialogs: {},

    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
    },

    /**
     * 获取对话框
     * @param {对话框的xtype} xtype 
     * @param {对话框的配置项} config 
     */
    getDialog: function (xtype, config) {
        var me = this,
            dialog = me.dialogs[xtype];
        if(dialog) return dialog;
        //判断对话框是否存在
        dialog = Ext.ClassManager.getByAlias('widget.' + xtype);
        //对话框不存在，抛出错误
        if (dialog === undefined) Ext.raise('No class:' + xtype);
        if (typeof (dialog) === 'function') {
            dialog = Ext.create(dialog, Ext.clone(config));
        };
        me.dialogs[xtype] = dialog;
        return dialog;
    },

    /**
     * 显示一个对话框
     * @param {对话框的xtype} xtype 
     * @param {对话框的配置对象} config 
     */
    show(xtype, config){
        let me = DialogManager,
            dlg = me.getDialog(xtype,config);
        if(me.lastView) me.lastView.hide();
        if(dlg) dlg.show();
        me.lastView = me.globalPages.includes(xtype.toLocaleLowerCase()) ? dlg : null;
        return dlg;
    },

    /**
     * 隐藏对话框
     * @param {对话框的xtype} xtype 
     */
    hide(xtype){
        let me = DialogManager,
            dlg = me.dialogs[xtype];
        if(dlg) {
            dlg.hide();
            me.lastView = null;
        }
    },

    /**
     * 隐藏视图
     */
    closeLasView(){
        let me = DialogManager;
        if(me.lastView) me.lastView.hide();
    }


});
