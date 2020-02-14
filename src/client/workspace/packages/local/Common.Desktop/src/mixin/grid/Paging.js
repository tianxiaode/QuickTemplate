/**
 * 将分页操作混入视图控制器
 */
Ext.define('Common.Desktop.mixin.grid.Paging', {
    mixinId: 'paginggridmixin',

    emptyPageData: {
        total: 0,
        currentPage: 0,
        pageCount: 0,
        toRecord: 0,
        fromRecord: 0
    },

    /**
     * 获取分页数据
     */
    getPageData: function() {
        let store = this.getStore(),
            totalCount = store.getTotalCount(),
            pageCount = Math.ceil(totalCount / store.pageSize),
            toRecord = Math.min(store.currentPage * store.pageSize, totalCount);
       
        return {
            total: totalCount,
            currentPage: store.currentPage,
            pageCount: Ext.Number.isFinite(pageCount) ? pageCount : 1,
            fromRecord: ((store.currentPage - 1) * store.pageSize) + 1,
            toRecord: toRecord || totalCount
        };
    },
    
    /**
     * 获取页数输入字段
     */
    getPagingInputItem: function(){
        return this.getButtonByKey('pageNumber');
    },

    /**
     * 初始化分页
     * @param {存储} store 
     */
    initPaging: function(store){
        let me = this,
            buttons = me._buttons || me.getButtons();
            pageNumber = buttons.getItems().getByKey('pageNumber');
        store.on({
            beforeload: me.onPagingOfBeforeLoad,
            load: me.onPagingOfLoad,
            exception: me.onPagingOfLoadError,
            scope: me    
        });
        pageNumber.on('blur', me.onPagingBlur, me);
        pageNumber.on('keyup', me.onPageNumberKeyup, me);
    },

    /**
     * 设置分页按钮状态
     */
    onPagingOfBeforeLoad: function(){
        let me = this;
        me.setPagingButtonDisabled('first', true);
        me.setPagingButtonDisabled('prev', true);
        me.setPagingButtonDisabled('next', true);
        me.setPagingButtonDisabled('last', true);
        me.setPagingButtonDisabled('refresh', true);
    },

    /**
     * 数据加载后更新分页情况
     */
    onPagingOfLoad:function(){
        let  me = this,
            store = me.getStore(),
            count = store.getCount(),
            afterPageText = '/ {0}',
            pageData = null,
            currPage =0,
            pageCount =0,
            isEmpty = count === 0,
            afterText = '',
            inputItem =  me.getPagingInputItem();
        
        if (!isEmpty) {
            pageData = me.getPageData();
            currPage = pageData.currentPage;
            pageCount = pageData.pageCount;

            // Check for invalid current page.
            if (currPage > pageCount) {
                // If the surrent page is beyond the loaded end,
                // jump back to the loaded end if there is a valid page count.
                if (pageCount > 0) {
                    store.loadPage(pageCount);
                }
                // If no pages, reset the page field.
                else {
                    inputItem.reset();
                }
                
                return;
            }

            afterText = Ext.String.format(afterPageText, isNaN(pageCount) ? 1 : pageCount);
        }
        else {
            currPage = 0;
            pageCount = 0;
            afterText = Ext.String.format(afterPageText, 0);
        }

        me.getButtonByKey('pageCount').setHtml(afterText);        
        inputItem.setDisabled(isEmpty)
        inputItem.setValue(currPage);
        
        me.setPagingButtonDisabled('first', currPage === 1 || isEmpty);
        me.setPagingButtonDisabled('prev', currPage === 1 || isEmpty);
        me.setPagingButtonDisabled('next', currPage === pageCount || isEmpty);
        me.setPagingButtonDisabled('last', currPage === pageCount || isEmpty);
        me.setPagingButtonDisabled('refresh', false);
        
    },

    /**
     * 根据按钮key获取按钮
     * @param {按钮key} key 
     */
    getButtonByKey: function(key){
        let buttons = this.getButtons() || this._buttons;
        return buttons.getItems().getByKey(key);
    },

    /**
     * 存储加载出错时设置按钮状态
     */
    onPagingOfLoadError: function(){
        this.setPagingButtonDisabled('refresh').setDisabled(false);
    },

    /**
     * 设置按钮状态
     * @param {按钮key} key 
     * @param {是否禁用} disabled 
     */
    setPagingButtonDisabled: function(key,disabled){
        let button = this.getButtonByKey(key);
        if(button) button.setDisabled(disabled);
    },

    /**
     * 第一页
     */
    onPagingMoveFirst: function() {
        this.getStore().loadPage(1);
    },

    /**
     * 上一页
     */
    onPagingMovePrevious: function() {
        var me = this,
            store = me.getStore(),
            prev = store.currentPage - 1;
        if (prev > 0) {
                store.previousPage();
                return true;
        }
        return false;
    },

    /**
     * 下一页
     */
    onPagingMoveNext: function() {
        var me = this,
            store = me.getStore(),
            total = me.getPageData().pageCount,
            next = store.currentPage + 1;

        if (next <= total) {
                store.nextPage();
                return true;
        }
        return false;
    },

    /**
     * 最后一页
     */
    onPagingMoveLast: function() {
        var me = this,
            last = me.getPageData().pageCount;
        me.getStore().loadPage(last);
        return true;
    },

    /**
     * 页数输入字段按下回车键后的操作
     * @param {字段} field 
     * @param {事件} e 
     */
    onPageNumberKeyup: function(field, e){
        var me = this,
            key = e.getKey(),
            pageData = me.getPageData(),
            increment = e.shiftKey ? 10 : 1,
            pageNum;

        if (key === e.RETURN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);

                if (pageNum !== pageData.currentPage ) {
                    me.getStore().loadPage(pageNum);
                }
            }
        }
        else if (key === e.HOME || key === e.END) {
            e.stopEvent();
            pageNum = key === e.HOME ? 1 : pageData.pageCount;
            field.setValue(pageNum);
        }
        else if (key === e.UP || key === e.PAGE_UP || key === e.DOWN || key === e.PAGE_DOWN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            
            if (pageNum) {
                if (key === e.DOWN || key === e.PAGE_DOWN) {
                    increment *= -1;
                }
                
                pageNum += increment;
                
                if (pageNum >= 1 && pageNum <= pageData.pageCount) {
                    field.setValue(pageNum);
                }
            }
        }
    },

    /**
     * 焦点移除页数输入字段时的操作
     */
    onPagingBlur: function(){
        let me = this
        let  [inputItem, curPage] = [me.getPagingInputItem(),0];

        if (inputItem) {
            curPage = me.getPageData().currentPage;
            inputItem.setValue(curPage);
        }

    },

    /**
     * 调整页数输入字段
     * @param {页数} pageData 
     */
    readPageFromInput: function(pageData) {
        var inputItem = this.getPagingInputItem(),
            pageNum = false,
            v;

        if (inputItem) {
            v = inputItem.getValue();
            pageNum = parseInt(v, 10);
            
            if (!v || isNaN(pageNum)) {
                inputItem.setValue(pageData.currentPage);

                return false;
            }
        }
        
        return pageNum;
    }


});