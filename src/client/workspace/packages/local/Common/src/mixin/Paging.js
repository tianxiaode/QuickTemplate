Ext.define('Common.mixin.Paging', {
    extend: 'Ext.Mixin',
    //mixinId: 'pagingGridMixin',

    mixinConfig: {
        before:{
            doDestroy: 'doDestroy'
        }
    },

    /**
     * 默认分页数据
     */
    emptyPageData: {
        total: 0, //记录总数
        currentPage: 0, //当前页
        pageCount: 0,  //总页数
        toRecord: 0, // 当前页最后记录号
        fromRecord: 0 //当前页开始记录号
    },

    /**
     * 获取分页数据
     */
    getPageData() {
        let store = this.pagingStore,
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
    
    // pagingListeners:{
    //     first: 'onPagingMoveFirst',
    //     prev: 'onPagingMovePrevious',
    //     pageNumber:{
    //         blur: 'onPagingBlur',
    //         keyup: 'onPageNumberKeyup'
    //     },
    //     next: 'onPagingMoveNext',
    //     last: 'onPagingMoveLast'
    // },


    /**
     * 获取分页输入字段
     */
    getPagingInputItem(){
        return this.getPagingButton('pagenumber');
    },

    /**
     * 初始化分页数�?
     * @param {存储} store 
     */
    initPaging(store){
        let me = this,
            pageNumber = me.getPagingInputItem();
        me.pagingStore = store;
        store.on({
            beforeload: me.onPagingOfBeforeLoad,
            load: me.onPagingOfLoad,
            exception: me.onPagingOfLoadError,
            scope: me    
        });
        if(pageNumber){
            pageNumber.on('blur', me.onPagingBlur, me);
            pageNumber.on('keyup', me.onPageNumberKeyup, me);    
        }
    },

    onPagingOfBeforeLoad(){
        let me = this;
        me.setPagingButtonDisabled('first', true);
        me.setPagingButtonDisabled('prev', true);
        me.setPagingButtonDisabled('next', true);
        me.setPagingButtonDisabled('last', true);
        me.setPagingButtonDisabled('refresh', true);
    },

    /**
     * 存储加载后刷新分页数�?
     */
    onPagingOfLoad(){
        let  me = this,
            store = me.pagingStore,
            count = store.getCount(),
            afterPageText = '/ {0}',
            pageData = null,
            currPage = 0,
            pageCount = 0,
            isEmpty = count === 0,
            afterText = '',
            inputItem = me.getPagingInputItem();
        
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
        let pageCountCmp = me.getPagingButton('pagecount');
        if(pageCountCmp) pageCountCmp.setHtml(afterText);   
        if(inputItem)     {
            inputItem.setDisabled(isEmpty)
            inputItem.setValue(currPage);    
        }
        
        me.setPagingButtonDisabled('first', currPage === 1 || isEmpty);
        me.setPagingButtonDisabled('prev', currPage === 1 || isEmpty);
        me.setPagingButtonDisabled('next', currPage === pageCount || isEmpty);
        me.setPagingButtonDisabled('last', currPage === pageCount || isEmpty);
        me.setPagingButtonDisabled('refresh', false);
        
    },

    /**
     * 获取所有分页按�?
     */
    getPagingButtons(){
        let me = this,
            pagingButtons = me.pagingButtons;
        if(!pagingButtons){
            let query = 'button[isPaging],field[isPaging],component[isPaging]';
                buttons =  me.getView && me.getView().query(query) || (me.query && me.query(query));
            pagingButtons = {};
            buttons.forEach(f=>{
                pagingButtons[f.pagingName] = f;
            });
            me.pagingButtons = pagingButtons;
        }
        return pagingButtons;

    },

    /**
     * 获取分页按钮
     */
     getPagingButton(key){
        let buttons  = this.getPagingButtons();
        return buttons[key];        
     },


     /**
      * 页面加载出错
      */
    onPagingOfLoadError(){
        this.getPagingButton('refresh').setDisabled(false);
    },

    /**
     * 禁用/启用按钮
     * @param {按钮的key} key 
     * @param {是否禁用} disabled 
     */
    setPagingButtonDisabled(key,disabled){
        let button = this.getPagingButton(key);
        if(button) button.setDisabled(disabled);
    },

    /**
     * 移动到第一�?
     */
    onPagingMoveFirst() {
        this.pagingStore.loadPage(1);
    },

    /**
     * 移动到上一�?
     */
    onPagingMovePrevious() {
        var me = this,
            store = me.pagingStore,
            prev = store.currentPage - 1;
        if (prev > 0) {
                store.previousPage();
                return true;
        }
        return false;
    },

    /**
     * 移动到下一�?
     */
    onPagingMoveNext() {
        let me = this,
            store = me.pagingStore,
            total = me.getPageData().pageCount,
            next = store.currentPage + 1;

        if (next <= total) {
                store.nextPage();
                return true;
        }
        return false;
    },

    /**
     * 移动到最后一�?
     */
    onPagingMoveLast() {
        let me = this,
            last = me.getPageData().pageCount;
        me.pagingStore.loadPage(last);
        return true;
    },

    /**
     * 响应分页输入字段的键盘事�?
     * @param {字段} field 
     * @param {事件} e 
     */
    onPageNumberKeyup(field, e){
        let me = this,
            key = e.getKey(),
            store  = me.pagingStore,
            pageData = me.getPageData(),
            increment = e.shiftKey ? 10 : 1,
            pageNum;

        if (key === e.RETURN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);

                if (pageNum !== pageData.currentPage ) {
                    store.loadPage(pageNum);
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
     * 分页输入字段失去焦点的操�?
     */
    onPagingBlur(){
        let me = this,
            inputItem = me.getPagingInputItem(),
            curPage = 0;
        if (inputItem) {
            curPage = me.getPageData().currentPage;
            inputItem.setValue(curPage);
        }

    },


    /**
     * 从分页输入字段获取页�?
     * @param {分页数据} pageData 
     */
    readPageFromInput(pageData) {
        let inputItem = this.getPagingInputItem(),
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
    },

    doDestroy(){
        this.emptyPageData = null;
    }


});