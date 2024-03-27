Ext.define('Common.mixin.crud.action.Create', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {
        /**
         * @cfg {String/Object} createForm
         * 表单xtype或表单定义，默认值为实体名称加"form",如：userform
         */
        createForm: null,

        /**
         * @cfg {String} createUrl
         * 新增记录的提交url，默认值为：http://域名/实体名复数
         */
        createUrl: null,

        /**
         * @cfg {String} createHttpMethod
         * 新增记录的提交方式
         */
        createHttpMethod: 'POST',

        /**
         * @cfg {String} createDialogTitle
         * 新增记录对话框的标题
         */
        createDialogTitle: null,
    },

    /**
    * 单击新疆按钮
    */
    onCreateButtonTap() {
        let me = this;
        if (me.onBeforeCreate() === false) return;
        me.doCreate();
    },

    /**
     * 在执行新建之前的操作，返回false可阻止对话框显示
     * @param {对话框} dialog 
     */
    onBeforeCreate() { },

    /**
     * 执行创建操作，可重写
     */
    doCreate() {
        let me = this;
        Ext.History.add(`${me.getPluralizeEntityName()}/add`);
        me.currentRecord = Ext.create(me.getModelName(), me.getRecordDefaultValue());
        let config = me.getDefaultDialogConfig('create');
        let dialog = Ext.create(config);
        dialog.show();
    },

    onAfterCreate() {
        this.onRefreshStore();
    },

    onCancelCreate() {
        Ext.History.back();
    },


});
