Ext.define('Common.mixin.crud.action.Export', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {


        /**
         * @cfg {Object} exportOptions
         * 导出操作的配置项
         */
        exportOptions: {
            /**
            * @cfg {Object} url
            * 导出url
            * 如果不设置，则使用默认的提交url
            */

            /**
            * @cfg {Object} method
            * 导出的提交方法，默认值为GET，
            * 如果设置为null，则不提交
            */
            method: 'GET',

            /**
            * @cfg {Object} success
            * 导出成功的回调函数
            */

            /**
            * @cfg {Object} cancel
            * 导出取消回的调函数
            */

            /**
            * @cfg {Object} failure
            * 导出失败回调函数
            */

            /**
             * @cfg {String} isConfirm
             * 是否需要确认
             * 默认值为false，表示不需要确认
             */

            /**
            * @cfg {Object} title
            * 导出确认对话框的title
            * 如果不设置，则使用默认的标题
            */

            /**
             * @cfg {String} confirmMessage
             * 导出确认对话框的提示消息
             * 如果不设置，则使用默认的标题
             */

            /**
             * @cfg {String} warning
             * 导出确认对话框的警告信息
             * 如果不设置，则使用默认的警告信息
             */


            /**
            * @cfg {Object} mask
            * 提交时遮罩层显示的信息
            * 如果不设置，则使用默认的遮罩层信息
            * 如果为异步delete，则不显示遮罩层
            */

            /**
            * @cfg {Object} successMessage
            * 提交成功的提示信息
            * 如果不设置，则使用默认的提示信息
            * 如果为异步操作，则显示提交成功的提示信息
            * 如果为同步操作，则不显示提示信息，开始进入下载流程
            */

            /**
            * @cfg {Object} failureMessage
            * 提交成功的提示信息
            * 如果不设置，则使用默认的提示信息
            */

            /**
            * @cfg {Boolean} isAsync
            * 是否异步操作
            */
            
            /**
            * @cfg {Boolean} isSelectData
            * 是否选择数据
            */
        }
    },

    /**
     * 调整删除确认对话框的配置项
     * @param {object} options 
     * @returns 
     */
    applyDeleteOptions(options) {
        let me = this,
            opts = Ext.apply({
                success: me.onExportSuccess.bind(me),
                cancel: me.onCancelExport.bind(me),
                failure: me.onExportFailure.bind(me),
                valueField: 'id',
                confirmMessage: 'DeleteConfirmMessage',
                warning: 'DeleteWarningMessage',
                isConfirm: false,
        }, options);
        opts.title = me.getLocalizedText(options.title ?? 'Export');
        return opts;
    },

    /**
    * 单击删除按钮
    * @param {Ext.Button/Ext.menu.Item} sender 单击的按钮或菜单项
    */
    onExportButtonTap(sender) {
        let me = this,
            type = sender.exportType,
            exports = me.getSelections();
        if (me.onBeforeExport(exports, type) === false) return;
        me.doExport(exports, type);
    },

    /**
     * 默认的导出之前操作，检测是否有选择的记录
     * 因为重写onBeforeExport有可能需要重写这部分代码，所以单独抽出来
     * @param {Array} records 要导出的记录数组
     * @returns 
     */
    onDefaultBeforeExport(records) {
        if (deletes.length > 0) return true;
        this.showNoSelectionAlert();
        return false;
    },

    /**
     * 执行导出操作之前的操作，返回false可取消操作
     * @param {Array} records 要导出的记录数组
     * @param {string} type 导出类型
     */
    onBeforeExport(records, type) {
        return this.onDefaultBeforeExport(records);
    },

    /**
    * 导出成功后的回调函数，默认刷新列表
     * @param {XMLHttpRequest} response The XMLHttpRequest object containing the response data. See www.w3.org/TR/XMLHttpRequest/ for details about accessing elements of the response.
     * @param {object} options 删除操作的配置项
    */
    onExportSuccess(response, options) {},

    /**
     * 取消导出的回调函数
     * @param {object} options 删除操作的配置项
     */
    onCancelExport(data) { },

    /**
     * 导出失败后的回调函数
     * @param {XMLHttpRequest} response The XMLHttpRequest object containing the response data. See www.w3.org/TR/XMLHttpRequest/ for details about accessing elements of the response.
     * @param {object} options 删除操作的配置项
     */
    onExportFailure(response, data) { },

    /**
     * 执行导出操作
     * @param {String} type 导出类型
     * @returns 
     */
    doExport(type) {
        let me = this,
            defaultOptions = me.getExportOptions(),
            isAsync = defaultOptions.isAsync,
            data =  me.getExportData();
            options = Ext.apply({
                type: type,
                url: me.getExportUrl(),
                messageField: me.getDefaultMessageField(),
                mask: me.getExportMaskMessage(isAsync, type),
                successMessage: me.getExportSuccessMessage(isAsync),
                failureMessage: me.getFailureMessage(isAsync),                
                messages:[]
            }, defaultOptions);
        me.onRequest(options);
    },

    /**
     * 获取导出url
     * 添加该方法是方便自定义导出url
     * @returns {string}
     */
    getExportUrl() {
        return this.getDefaultUrl() + '/export';
    },

    /**
     * 获取删除操作的提交参数
     * 添加该方法是方便自定义提交参数格式
     * @param {Array} records 要删除的记录数组
     * @param {String} valueField 值字段
     * @param {String} messageField 提示信息字段
     * @returns {Object}
     */
    getExportData(records, valueField, messageField) {
        return this.getRequestData(records, valueField, messageField);
    },

    
    /**
     * 获取导出mask信息
     * @param {Boolean} isAsync 是否异步操作
     * @param {String} type 导出类型
     * @returns  {string}
     */
    getExportMaskMessage(isAsync, type) {
        if(isAsync) return false;
        if(type === 'pdf') return 'ExportingPdf';
        if(type === 'excel') return 'ExportingExcel';
        if(type === 'csv') return 'ExportingCsv';
        return 'ExportSuccessMessage';
    },

    /**
     * 获取导出成功的提示信息
     * @param {Boolean} isAsync 是否异步操作
     * @returns {string}
     */
    getExportSuccessMessage(isAsync) {
        if(isAsync) return "AsyncExportSuccessMessage";
        return "ExportSuccessMessage";
    },

    /**
     * 获取导出失败的提示信息
     * @param {Boolean} isAsync 是否异步操作
     * @returns {string}
     */
    getFailureMessage(isAsync){
        if(isAsync) return "AsyncExportErrorMessage";
        return "ExportErrorMessage";
    },

    doDestroy(){
        this.destroyMembers('exportOptions');
    }


});
