Ext.define('Common.mixin.crud.action.Create', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {

        /**
         * @cfg {Object} createDialog
         * 新建对话框的配置项，可重写
         */
        createDialog:{
            /**
            * @cfg {Object} xtype
            * 新建对话框的xtype
            */            

            /**
            * @cfg {Object} title
            * 新建对话框的title
            */            

            /**
            * @cfg {Object/String} form
            * 新建对话框的form的配置对象或xtype
            */            

            /**
            * @cfg {Object} url
            * 新建对话框的提交url
            * 如果不设置，则使用默认的提交url
            */            

            /**
            * @cfg {Object} method
            * 新建对话框的提交方法，默认值为POST，
            * 如果设置为null，则不提交
            */ 
           method: 'GET',

            /**
            * @cfg {Object} callback
            * 新建对话框的提交成功回调函数
            */            

            /**
            * @cfg {Object} cancelCallback
            * 新建对话框的取消回调函数
            */            
        },
    },


    /**
     * 调整新建对话框的配置项
     * @param {object} config 
     * @returns 
     */
    applyCreateDialog(config) {
        let me = this;
        config = Ext.clone(config);
        if(Ext.isString(config.form)) {
            config.form = { xtype: config.form };
        }
        if(!config.callback){
            config.callback = me.onAfterCreate.bind(me);
        }

        if(!config.cancelCallback){
            config.cancelCallback = me.onCancelCreate.bind(me);
        }
        return config;
    },


    /**
     * 获取新建对话框配置项
     * @returns {Object} 创建对话框的配置项
     */
    getCreateDialogConfig(){
        let me = this,
            defaultConfig = me.getDefaultDialogConfig(),
            custom = me.getCreateDialog(),
            form = Ext.apply(defaultConfig.form, custom.form),
            config;
        config = Ext.apply({
            xtype: 'uxformdialog',
            action: 'create',
            url: me.getDefaultUrl(),
            createConfig: me.getCreateConfig(),
        }, custom , defaultConfig);
        config.form = form;
        return config;
    },

    getCreateConfig(){
        let config = this.getCreateDialog();
        return {
            url: config.url || this.getDefaultUrl(),
            method: config.method,
            title: config.title
        };
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
        let config = me.getCreateDialogConfig();
        Logger.debug(this.doCreate, config);
        let dialog = Ext.create(config);
        dialog.show();
    },

    /**
     * 新建成功后的回调函数，默认刷新列表
     */
    onAfterCreate() {
        this.onRefreshStore();
    },

    /**
     * 取消新建的回调函数，默认返回上一页
     */
    onCancelCreate() {
        Ext.History.back();
    },

    doDestroy(){
        this.destroyMembers('createDialog');
    }


});
