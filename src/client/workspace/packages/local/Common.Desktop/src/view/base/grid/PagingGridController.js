Ext.define('Common.Desktop.view.base.grid.PagingGridController',{
    extend: 'Common.Desktop.view.base.grid.GridController',
    alias: 'controller.basePagingGrid',
 
    // mixins:[
    //     'Common.Modern.desktop.mixin.grid.Paging'
    // ],

    emptyPageData: {
        total: 0,
        currentPage: 0,
        pageCount: 0,
        toRecord: 0,
        fromRecord: 0
    },

    getPageData: function() {
        var store = this.mainStore,
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

    initPaging: function(store){
        let me = this,
            pageNumber = me.getButtonByKey('pageNumber');
        store.on({
            beforeload: me.onPagingOfBeforeLoad,
            load: me.onPagingOfLoad,
            exception: me.onPagingOfLoadError,
            scope: me    
        });
        pageNumber.on('blur', me.onPagingBlur, me);
        pageNumber.on('keyup', me.onPageNumberKeyup, me);
    },

    getPagingInputItem: function(){
        return this.getButtonByKey('pageNumber');
    },

    onPagingOfBeforeLoad: function(){
        let me = this;
        me.setPagingButtonDisabled('first', true);
        me.setPagingButtonDisabled('prev', true);
        me.setPagingButtonDisabled('next', true);
        me.setPagingButtonDisabled('last', true);
        me.setPagingButtonDisabled('refresh', true);
    },

    onPagingOfLoad:function(){
        let  me = this,
            store = me.mainStore,
            count = store.getCount(),
            afterPageText = '/ {0}', 
            pageData = null,
            currPage =0, 
            pageCount =0,
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

        me.getButtonByKey('pageCount').setHtml(afterText);        
        inputItem.setDisabled(isEmpty)
        inputItem.setValue(currPage);
        
        me.setPagingButtonDisabled('first', currPage === 1 || isEmpty);
        me.setPagingButtonDisabled('prev', currPage === 1 || isEmpty);
        me.setPagingButtonDisabled('next', currPage === pageCount || isEmpty);
        me.setPagingButtonDisabled('last', currPage === pageCount || isEmpty);
        me.setPagingButtonDisabled('refresh', false);
        
    },

    onPagingOfLoadError: function(){
        this.setPagingButtonDisabled('refresh').setDisabled(false);
    },

    setPagingButtonDisabled: function(key,disabled){
        let button = this.getButtonByKey(key);
        if(button) button.setDisabled(disabled);
    },

    onPagingMoveFirst: function() {
        this.mainStore.loadPage(1);
    },

    onPagingMovePrevious: function() {
        var me = this,
            store = me.mainStore,
            prev = store.currentPage - 1;
        if (prev > 0) {
                store.previousPage();
                return true;
        }
        return false;
    },

    onPagingMoveNext: function() {
        var me = this,
            store = me.mainStore,
            total = me.getPageData().pageCount,
            next = store.currentPage + 1;

        if (next <= total) {
                store.nextPage();
                return true;
        }
        return false;
    },

    onPagingMoveLast: function() {
        var me = this,
            last = me.getPageData().pageCount;
        me.mainStore.loadPage(last);
        return true;
    },

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
                    me.mainStore.loadPage(pageNum);
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

    onPagingBlur: function(){
        let me = this
        let  [inputItem, curPage] = [me.getPagingInputItem(),0];

        if (inputItem) {
            curPage = me.getPageData().currentPage;
            inputItem.setValue(curPage);
        }

    },

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
