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
             * 默认值为true，表示需要确认
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
            * @cfg {Boolean} isAsyncExportSelected
            * 导出选择是否异步操作
            * 默认值为false，表示导出选择采用同步操作
            */
            
            /**
            * @cfg {Boolean} isAsyncExportSearch
            * 导出查询是否异步操作
            * 默认值为true，表示导出查询采用异步操作
            */

            /**
            * @cfg {Boolean} isAsyncExportAll
            * 导出全部是否异步操作
            * 默认值为true，表示导出全部采用异步操作
            */
}
    },

    /**
     * 调整删除确认对话框的配置项
     * @param {object} options 
     * @returns 
     */
    applyExportOptions(options) {
        let me = this,
            opts = Ext.apply({
                success: me.onExportSuccess.bind(me),
                cancel: me.onCancelExport.bind(me),
                failure: me.onExportFailure.bind(me),
                valueField: 'id',
                isConfirm: true,
                isAsyncExportSelected: false,
                isAsyncExportSearch: true,
                isAsyncExportAll: true,
        }, options);
        opts.title = me.getLocalizedText(options.title ?? 'Export');
        return opts;
    },

    /**
     * 单击导出类型菜单项
     * @param {Ext.menu.RadioItem} sender 导出类型菜单项
     */
    onExportTypeButtonTap(sender){
        this.exportType = sender.exportType;
    },

    /**
    * 单击导出按钮
    * @param {Ext.Button/Ext.menu.Item} sender 单击的按钮或菜单项
    */
    onExportButtonTap(sender) {
        let me = this,
            type = me.exportType || Constant.EXPORT_TYPE_SELECTED,
            format = sender.exportFormat,
            records = me.getSelections();
        if (me.onBeforeExport(records, type, format) === false) return;
        me.doExport(records, type , format);
    },

    /**
     * 默认的导出之前操作，检测是否有选择的记录
     * 因为重写onBeforeExport有可能需要重写这部分代码，所以单独抽出来
     * @param {Array} records 要导出的记录数组
     * @param {string} type 导出类型
     * @returns 
     */
    onDefaultBeforeExport(records, type) {
        //导出类型为非选择类型时，不检查是否有选择的记录
        if(type !== Constant.EXPORT_TYPE_SELECTED) return true;
        if (records.length > 0) return true;
        this.showNoSelectionAlert();
        return false;
    },

    /**
     * 执行导出操作之前的操作，返回false可取消操作
     * @param {Array} records 要导出的记录数组
     * @param {string} type 导出类型
     * @param {string} format 导出格式
     */
    onBeforeExport(records, type, format) {
        return this.onDefaultBeforeExport(records, type);
    },

    /**
    * 导出成功后的回调函数，默认刷新列表
     * @param {XMLHttpRequest} response The XMLHttpRequest object containing the response data. See www.w3.org/TR/XMLHttpRequest/ for details about accessing elements of the response.
     * @param {object} options 删除操作的配置项
    */
    onExportSuccess(response, options) {
        let me = this,
            data = response.getJson();
        Logger.debug(this.onExportSuccess, data);
        if(data.isAsync) return;
        me.downloadExportFile(data.file, options);
    },

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
     * @param {Array} records 要导出的记录数组
     * @param {String} type 导出类型
     * @param {String} format 导出格式
     */
    doExport(records, type, format) {
        let me = this,
            defaultOptions = me.getExportOptions(),
            data =  me.getExportData(records, type, format, defaultOptions);
            options = Ext.apply({
                type: type,
                url: me.getExportUrl(),
                messageField: me.getDefaultMessageField(),
                mask: me.getExportMaskMessage(defaultOptions, type, format),
                confirmMessage: me.getExportConfirmMessage(defaultOptions, type, format),
                successMessage: me.getExportSuccessMessage(defaultOptions, type, format),
                failureMessage: me.getFailureMessage(defaultOptions, type, format), 
                data: data,
                messages:[]
            }, defaultOptions);
        Logger.debug(this.doExport, options);
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
     * @param {String} type 导出类型
     * @param {String} format 导出格式
     * @param {String} valueField 值字段
     * @returns {Object}
     */
    getExportData(records, type, format, options) {
        let data = { format: format, isAll: false, isSelected: false, isSearch: false, isAsync: false };
        if(type === Constant.EXPORT_TYPE_ALL) {
            //设置是否异步导出
            if(options.isAsyncExportAll) data.isAsync = true;

            //设置为导出全部
            data.isAll = true;
            return data;
        }
        if(type === Constant.EXPORT_TYPE_SELECTED) {
            //设置是否异步导出
            if(options.isAsyncExportSelected) data.isAsync = true;

            //设置为导出选择
            data.isSelected = true;

            //获取选择的记录id
            data.ids = this.getRequestData(records, options.valueField).data;
            return data;
        }
        if(type === Constant.EXPORT_TYPE_SEARCH) {
            //设置是否异步导出
            if(options.isAsyncExportSearch) data.isAsync = true;

            //设置为导出查询
            data.isSearch = true;

            //调用Searchable的getSearchValues方法获取查询参数并并入提交数据
            Ext.apply(data, this.getSearchValues());
            return data;
        }
        return data;
    },

    
    /**
     * 获取导出mask信息
     * @param {Object} options 导出配置项
     * @param {String} type 导出类型
     * @param {String} format 导出格式
     * @returns  {string}
     */
    getExportMaskMessage(options, type, format) {
        if(type === Constant.EXPORT_TYPE_ALL && options.isAsyncExportAll) return false;
        if(type === Constant.EXPORT_TYPE_SELECTED && options.isAsyncExportSelected) return false;
        if(type === Constant.EXPORT_TYPE_SEARCH && options.isAsyncExportSearch) return false;
        if(format === Constant.EXPORT_FORMAT_PDF) return 'ExportingPdf';
        if(format === Constant.EXPORT_FORMAT_EXCEL) return 'ExportingExcel';
        if(format === Constant.EXPORT_FORMAT_CSV) return 'ExportingCsv';
        return 'Exporting';
    },

    /**
     * 获取导出确认对话框的提示消息
     * @param {Object} options 导出配置项
     * @param {String} type 导出类型
     * @param {String} format 导出格式
     * @returns {string}
     */
    getExportConfirmMessage(options, type, format) {
        if(type === Constant.EXPORT_TYPE_SELECTED){
            if(format === Constant.EXPORT_FORMAT_PDF) return 'ConfirmExportSelectedToPdf';
            if(format === Constant.EXPORT_FORMAT_EXCEL) return 'ConfirmExportSelectedToExcel';
            if(format === Constant.EXPORT_FORMAT_CSV) return 'ConfirmExportSelectedToCsv';
        }
        if(type === Constant.EXPORT_TYPE_ALL){
            if(format === Constant.EXPORT_FORMAT_PDF) return 'ConfirmExportAllToPdf';
            if(format === Constant.EXPORT_FORMAT_EXCEL) return 'ConfirmExportAllToExcel';
            if(format === Constant.EXPORT_FORMAT_CSV) return 'ConfirmExportAllToCsv';
        }
        if(type === Constant.EXPORT_TYPE_SEARCH){
            if(format === Constant.EXPORT_FORMAT_PDF) return 'ConfirmExportSearchToPdf';
            if(format === Constant.EXPORT_FORMAT_EXCEL) return 'ConfirmExportSearchToExcel';
            if(format === Constant.EXPORT_FORMAT_CSV) return 'ConfirmExportSearchToCsv';
        }
        return 'ConfirmExport';
    },

    /**
     * 获取导出成功的提示信息
     * @param {Object} options 导出配置项
     * @param {String} type 导出类型
     * @param {String} format 导出格式
     * @returns {string}
     */
    getExportSuccessMessage(options, type, format) {
        if(type === Constant.EXPORT_TYPE_ALL && options.isAsyncExportAll) return "AsyncExportAllSuccessMessage";
        if(type === Constant.EXPORT_TYPE_SELECTED && options.isAsyncExportSelected) return "AsyncExportSelectedSuccessMessage";
        if(type === Constant.EXPORT_TYPE_SEARCH && options.isAsyncExportSearch) return "AsyncExportSearchSuccessMessage";
        return "ExportSuccessMessage";
    },

    /**
     * 获取导出失败的提示信息
     * @param {Object} options 导出配置项
     * @param {String} type 导出类型
     * @param {String} format 导出格式
     * @returns {string}
     */
    getFailureMessage(options, type, format){
        if(options.isAsyncExportAll || options.isAsyncExportSelected || options.isAsyncExportSearch) return "AsyncExportErrorMessage";
        return "ExportErrorMessage";
    },


    doDestroy(){
        this.destroyMembers('exportOptions');
    }


});
