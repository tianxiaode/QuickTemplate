Ext
Ext.define('Common.ux.toolbar.Paging',{
    extend: 'Ext.Ext.Toolbar',
    xtype: 'uxpagingtoolbar',

    requires:[
        'Ext.field.Select',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.field.Number'
    ],

    classCls: Ext.baseCSSPrefix + 'pagingtoolbar',
    defaultBindProperty: 'store',
    bind: '{mainStore}',

    emptyPageData: {
        total: 0, //记录总数
        currentPage: 0, //当前页
        pageCount: 0,  //总页数
        toRecord: 0, // 当前页最后记录号
        fromRecord: 0 //当前页开始记录号
    },

    config: {
        store: null,
        firstButton:{},
        prevButton: {},
        pageNumber:{},
        pageCount:{},
        nextButton: {},
        lastButton:{},
        refreshButton:{},
        pageSize:{},
        summaryComponent: {}
    },

    createFirstButton(config){
        return Ext.apply({
            xtype: 'button',
            weight: 100,
            disabled: true,
            iconCls: 'x-fa fa-angle-double-left',
            handler: this.onFirstPageTap,
            ownerCmp: this
        }, config);
    },

    updateFirstButton(config, old){
        return Ext.updateWidget(old, config, this, 'createFirstButton');
    },

    applyFirstButton(config){
        config && this.add(config);
    },

    createPrevButton(config){
        return Ext.apply({
            xtype: 'button',
            weight: 200,
            isPageing: true,
            disabled: true,
            iconCls: 'x-fa fa-angle-left',
            handler: this.onPrevtPageTap,
            ownerCmp: this
        }, config);
    },

    applyPrevButton(config, old){
        return Ext.updateWidget(old, config, this, 'createPrevButton');
    },

    updatePrevButton(config){
        config && this.add(config);
    },

    createPageNumber(config){
        let me = this;
        return Ext.apply({
            xtype: 'numberfield',
            weight: 300,
            isPageing: true,
            disabled: true,
            value: 1,
            listeners:{
                blur: me.onPagingNumberBlur,
                keyup: me.onPageNumberKeyUp,
                scope: me
            },
            ownerCmp: me
        }, config);
    },

    applyPageNumber(config, old){
        return Ext.updateWidget(old, config, this, 'createPageNumber');
    },

    updatePageNumber(config){
        config && this.add(config);
    },

    createPageCount(config){
        return Ext.apply({
            xtype: 'componet',
            isPageing: true,
            weight: 400,
            disabled: true,
            ownerCmp: this
        }, config);
    },

    applyPageCount(config, old){
        return Ext.updateWidget(old, config, this, 'createPageCount');
    },

    updatePageCount(config){
        config && this.add(config);
    },

    createNextButton(config){
        return Ext.apply({
            xtype: 'button',
            isPageing: true,
            weight: 500,
            disabled: true,
            iconCls: 'x-fa fa-angle-right',
            handler: this.onNextPageTap,
            ownerCmp: this
        }, config);
    },

    applyNextButton(config, old){
        return Ext.updateWidget(old, config, this, 'createNextButton');
    },

    updateNextButton(config){
        config && this.add(config);
    },

    createLastButton(config){
        return Ext.apply({
            xtype: 'button',
            isPageing: true,
            weight: 600,
            disabled: true,
            iconCls: 'x-fa fa-angle-double-right',
            handler: this.onLastPageTap,
            ownerCmp: this
        }, config);
    },

    applyLastButton(config, old){
        return Ext.updateWidget(old, config, this, 'createLastButton');
    },

    updateLastButton(config){
        config && this.add(config);
    },
    
    createRefreshButton(config){
        return Ext.apply({
            xtype: 'uxrefireshbutton',
            isPageing: true,
            weight: 700,
            disabled: true,
            handler: this.onRefreshTap,
            ownerCmp: this
        }, config);
    },

    applyRefreshButton(config, old){
        return Ext.updateWidget(old, config, this, 'createRefreshButton');
    },

    updateRefreshButton(config){
        config && this.add(config);
    },

    applyPageSize(config, old){
        return Ext.updateWidget(old, config, this, 'createRefreshButton');
    },

    createPageSize(config){
        let me = this;
        return Ext.apply({
            xtype: 'select',
            flex: 1,
            weight: 700,
            isPageing: true,
            disabled: true,
            listeners:{
                change: me.onPageSizeChange,
                scope: me
            },
            ownerCmp: me
        }, config);
    },

    updatePageSize(config, old){
        return Ext.updateWidget(old, config, this, 'createPageSize');
    },

    updatePageSize(config){
        config && this.add(config);
    },

    createSummaryComponent(config){
        return Ext.apply({
            xtype: 'componet',
            margin: '0 5px',
            isPageing: true,
            style:{
                textAlign: 'right'
            },
            flex: 1,
            weight: 800,
            disabled: true,
            ownerCmp: this
        }, config);
    },

    applySummaryComponent(config){
        return Ext.updateWidget(old, config, this, 'createSummaryComponent');
    },

    updateSummaryComponent(config){
        config && this.add(config);
    },

    applyStore(store) {
        if (store) {
            store = Ext.data.StoreManager.lookup(store);
        }

        return store;
    },

    updateStore(store, oldStore) {
        var me = this;

        if (oldStore) {
            if (oldStore.getAutoDestroy()) {
                oldStore.destroy();
            }
        }

        if (store) {

            store.on({
                scope: me,
                load: {
                    fn: 'onStoreLoad',
                    priority: -1
                },
                beforeLoad: 'onStoreBeforeLoad',
                refresh: 'onStoreRefresh'
            });

            if (store.isLoaded() && !store.hasPendingLoad()) {
                me.initPaging();
            }
        }
    },

    /**
     * 单击第一页
     * @param {触发组件} sender 
     */
    onFirstPageTap(sender){
        this.getStore().loadPage(1);
    },

    /**
     * 单击上一页
     * @param {触发组件} sender 
     */
    onPrevtPageTap(sender){
        let me = this,
            store = me.getStore(),
            prev = store.currentPage - 1;
        if (prev > 0) {
                store.previousPage();
        }
    },
    
    /**
     * 响应分页输入字段的键盘事件
     * @param {字段} sender 
     * @param {事件} e 
     */
    onPageNumberKeyup(sender, e){
        let me = this,
            key = e.getKey(),
            store  = me.getStore(),
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
     * 焦点移出分页输入
     * @param {触发组件} sender 
     * @param {事件} e 
     */
    onPageNumberBlur(sender, e){
        let me = this,
            field = me.getPageNumber(),
            curPage = 0;
        if (!field) return;
        curPage = me.getPageData().currentPage;
        field.setValue(curPage);
    },
    
    /**
     * 单击下一页
     * @param {触发组件} sender 
     */
    onNextPageTap(sender){
        let me = this,
            store = me.getStore(),
            pageCount = me.getPageData().pageCount,
            next = store.currentPage + 1;

        if (next <= pageCount) {
                store.nextPage();
        }
    },

    /**
     * 单击最后一页
     * @param {触发组件} sender 
     */
    onLastPageTap(sender){
        let me = this,
            last = me.getPageData().pageCount;
        me.pagingStore.loadPage(last);
    },

    onPageSizeChange(sender, value , oldValue){

    },

    onStoreLoad(){
        this.initPaging();
    },

    onStoreRefresh(){
        this.getStore().load();
    },

    onStoreBeforeLoad(){
        this.setItemsDisabled(0, 0, true, true);
    },

    initPaging(){
        let  me = this,
            store = me.getStore(),
            count = store.getCount(),
            afterPageText = '/ {0}',
            pageData = null,
            currPage = 0,
            pageCount = 0,
            isEmpty = count === 0,
            afterText = '',
            pageNumber = me.getPageNumber()
            summay = me.getSummaryComponent();
        
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
                    pageNumber && pageNumber.reset();
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
        let pageCountCmp = me.getPageCount();
        pageCountCmp && pageCountCmp.setHtml(afterText);   
        if(pageNumber)     {
            pageNumber.setDisabled(isEmpty)
            pageNumber.setValue(currPage);    
        }
        
        
        me.setItemsDisabled(currPage, pageCount, isEmpty, false);
    },




    doDestroy() {
        var me = this,
            store = me.getStore();

        if (store && !store.destroyed && store.getAutoDestroy()) {
            store.destroy();
        }

        me.emptyPageData = null;
        me.destroyMembers(
            'firstButton', 'prevButton', 'pageNumber', 
            'pageCount', 'nextButton', 'nextButton',
            'nextButton', 'lastButton', 'refreshButton',
            'pageSize', 'summaryComponent'
        );

        me.callParent();
    },

    privates:{
        /**
         * 获取分页数据
         */
        getPageData() {
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

        setItemsDisabled(currPage, pageCount, isEmpty, refreshDisabled){
            let me = this,
                first = me.getFirstButton(),
                prev  = me.getPrevButton(),
                pageNumber = me.getPageNumber(),
                pageCountCmp = me.getPageCount(),
                next = me.getNextButton(),
                last = me.getLastButton(),
                refresh = me.getRefreshButton(),
                pageSize = me.getPageSize(),
                summay = me.getSummaryComponent();
            first && first.setDisabled(currPage === 1 || isEmpty);
            prev && prev.setDisabled(currPage === 1 || isEmpty);
            next && next.setDisabled(currPage === pageCount || isEmpty);
            last && last.setDisabled(currPage === pageCount || isEmpty);
            pageNumber.setDisabled(pageCount === 1 || isEmpty);
            pageCountCmp.setDisabled(false);
            pageSize.setDisabled(isEmpty);
            refresh.setDisabled(refreshDisabled);
            summay.setDisabled(false);
        
        },

        /**
         * 从分页输入字段获取页数
         * @param {分页数据} pageData 
         */
        readPageFromInput(pageData) {
            let field = this.getPageNumber(),
                pageNum = false,
                v;
            if(!field) return pageNum;
            v = field.getValue();
            pageNum = parseInt(v, 10);
            
            if (!v || isNaN(pageNum)) {
                field.setValue(pageData.currentPage);

                return false;
            }            
            return pageNum;
        },

        
    }

    

})
