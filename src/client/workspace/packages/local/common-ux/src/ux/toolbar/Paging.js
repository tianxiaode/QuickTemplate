Ext.define('Common.ux.toolbar.Paging', {
    extend: 'Ext.Toolbar',
    xtype: 'uxpagingtoolbar',

    requires: [
        'Ext.field.Select',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.field.Number',
        'Common.ux.button.Option'
    ],

    mixins:[
        'Common.mixin.button.Refresh',
        'Common.mixin.Spacer',
        'Common.mixin.CountMessage'
    ],

    classCls: Ext.baseCSSPrefix + 'pagingtoolbar',
    defaultBindProperty: 'store',
    userCls: 'bg-content',
    weighted: true,

    emptyPageData: {
        total: 0, //记录总数
        currentPage: 0, //当前页
        pageCount: 0,  //总页数
        toRecord: 0, // 当前页最后记录号
        fromRecord: 0 //当前页开始记录号
    },

    default:{
        isPaging: true
    },

    config: {
        store: null,
        firstButton: {},
        prevButton: {},
        pageNumber: {},
        pageCount: {},
        nextButton: {},
        lastButton: {},
        pageSize: {},
        spacer: { weight: 800},
        pageSizeText:{},
        refreshButton: {isPaging: true},
        countMessage:{ weight: 1100, flex: null }
    },

    createFirstButton(config) {
        return Ext.apply({
            xtype: 'button',
            weight: 100,
            isPaging: true,
            disabled: true,
            iconCls: Ext.baseCSSPrefix + 'pagingtoolbar-first',
            handler: this.onFirstPageTap,
            ownerCmp: this
        }, config);
    },

    applyFirstButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createFirstButton');
    },

    updateFirstButton(config) {
        config && this.add(config);
    },

    createPrevButton(config) {
        return Ext.apply({
            xtype: 'button',
            weight: 200,
            isPaging: true,
            disabled: true,
            iconCls: Ext.baseCSSPrefix + 'pagingtoolbar-prev',
            handler: this.onPrevPageTap,
            ownerCmp: this
        }, config);
    },

    applyPrevButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createPrevButton');
    },

    updatePrevButton(config) {
        config && this.add(config);
    },

    createPageNumber(config) {
        let me = this;
        return Ext.apply({
            xtype: 'numberfield',
            weight: 300,
            width: 60,
            isPaging: true,
            disabled: true,
            value: 1,
            autoLabel: false,
            listeners: {
                blur: me.onPageNumberBlur,
                keyup: me.onPageNumberKeyUp,
                scope: me
            },
            ownerCmp: me
        }, config);
    },

    applyPageNumber(config, old) {
        return Ext.updateWidget(old, config, this, 'createPageNumber');
    },

    updatePageNumber(config) {
        config && this.add(config);
    },

    createPageCount(config) {
        return Ext.apply({
            xtype: 'component',
            isPaging: true,
            weight: 400,
            userCls: 'mx-2',
            disabled: true,
            ownerCmp: this
        }, config);
    },

    applyPageCount(config, old) {
        return Ext.updateWidget(old, config, this, 'createPageCount');
    },

    updatePageCount(config) {
        config && this.add(config);
    },

    createNextButton(config) {
        return Ext.apply({
            xtype: 'button',
            isPaging: true,
            weight: 500,
            disabled: true,
            iconCls: Ext.baseCSSPrefix + 'pagingtoolbar-next',
            handler: this.onNextPageTap,
            ownerCmp: this
        }, config);
    },

    applyNextButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createNextButton');
    },

    updateNextButton(config) {
        config && this.add(config);
    },

    createLastButton(config) {
        return Ext.apply({
            xtype: 'button',
            isPaging: true,
            weight: 600,
            disabled: true,
            iconCls: Ext.baseCSSPrefix + 'pagingtoolbar-last',
            handler: this.onLastPageTap,
            ownerCmp: this
        }, config);
    },

    applyLastButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createLastButton');
    },

    updateLastButton(config) {
        config && this.add(config);
    },

    createPageSize(config) {
        let me = this;
        return Ext.apply({
            xtype: 'uxoptionbutton',
            weight: 900,
            isPaging: true,
            disabled: true,
            autoLabel: false,
            options: [25, 50, 100],
            listeners: {
                change: me.onPageSizeChange,
                scope: me
            },
            ownerCmp: me
        }, config);
    },

    applyPageSize(config, old) {
        return Ext.updateWidget(old, config, this, 'createPageSize');
    },

    updatePageSize(config) {
        config && this.add(config);
    },

    createPageSizeText(config){
        return Ext.apply({
            xtype: 'component',
            isPaging: true,            
            weight: 1000,
            userCls: 'mx-2',
            html: ` ${I18N.get('item')} / ${I18N.get('page')} , `,
            ownerCmp: this
        },config)
    },

    applyPageSizeText(config, old){
        return Ext.updateWidget(old, config, this, 'createPageSizeText');
    },

    updatePageSizeText(config){
        config && this.add(config);
    },

    applyStore(store) {
        let ret = store ? Ext.data.StoreManager.lookup(store) : null;

        return ret;
    },

    updateStore(store, oldStore) {
        let me = this;
        if (oldStore) {
            if (!oldStore.destroyed) {
                if (oldStore.getAutoDestroy()) {
                    oldStore.destroy();
                }
                else {
                    Ext.destroy(me.storeListeners);
                }
            }
        }

        if (store) {
            if (me.destroying) {
                return;
            }

            me.refreshPageSize(store.getPageSize())

            me.storeListeners = store.on({
                scope: me,
                destroyable: true,
                load: me.onStoreLoad,
                beforeload: me.onStoreBeforeLoad
            });

            if (store.isLoaded() && !store.hasPendingLoad()) {
                me.initPaging();
            }
        }


    },

    onRefreshButtonTap(){
        this.onRefreshStore();
    },

    refreshPageSize(pageSize){
        let cmp = this.getPageSize();
        cmp.setText(pageSize);
        cmp.setValue(pageSize);
    },

    /**
     * 单击第一页
     * @param {触发组件} sender 
     */
    onFirstPageTap(sender) {
        this.getStore().loadPage(1);
    },

    /**
     * 单击上一页
     * @param {触发组件} sender 
     */
    onPrevPageTap(sender) {
        let me = this,
            store = me.getStore(),
            prev = store.currentPage - 1;
        if (prev > 0) {
            store.previousPage();
        }
    },


    /**
     * 单击下一页
     * @param {触发组件} sender 
     */
    onNextPageTap(sender) {
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
    onLastPageTap(sender) {
        let me = this,
            last = me.getPageData().pageCount;
        me.pagingStore.loadPage(last);
    },

    onPageSizeChange(sender, value, oldValue) {
        let store = this.getStore();
        Logger.debug(this.onPageSizeChange, value);
        store.setPageSize(value);
        store.loadPage(1);
    },

    onStoreLoad() {
        this.initPaging();
    },

    onStoreBeforeLoad() {
        this.setItemsDisabled(0, 0, true, true);
    },

    onRefreshStore(){
        this.getStore().load();
    },

    initPaging() {
        let me = this,
            store = me.getStore(),
            count = store.getCount(),
            afterPageText = ' / {0}',
            pageData = null,
            currPage = 0,
            pageCount = 0,
            isEmpty = count === 0,
            afterText = '',
            pageNumber = me.getPageNumber(),
            countMessage = me.getCountMessage();

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
        if (pageNumber) {
            pageNumber.setDisabled(isEmpty)
            pageNumber.setValue(currPage);
        }
        
        me.setDataCount(count);


        me.setItemsDisabled(currPage, pageCount, isEmpty, false);
    },




    doDestroy() {
        var me = this,
            store = me.getStore();

        if (store && !store.destroyed && store.getAutoDestroy()) {
            store.destroy();
        }

        me.destroyMembers(
            'firstButton', 'prevButton', 'pageNumber',
            'pageCount', 'nextButton', 'nextButton',
            'nextButton', 'lastButton', 
            'pageSize', 'emptyPageData', 'spacer', 'pageSizeText'
        );

        me.callParent();
    },

    privates: {
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

        setItemsDisabled(currPage, pageCount, isEmpty, refreshDisabled) {
            let me = this,
                first = me.getFirstButton(),
                prev = me.getPrevButton(),
                pageNumber = me.getPageNumber(),
                pageCountCmp = me.getPageCount(),
                next = me.getNextButton(),
                last = me.getLastButton(),
                refresh = me.getRefreshButton(),
                pageSize = me.getPageSize(),
                countMessage = me.getCountMessage();
            first && first.setDisabled(currPage === 1 || isEmpty);
            prev && prev.setDisabled(currPage === 1 || isEmpty);
            next && next.setDisabled(currPage === pageCount || isEmpty);
            last && last.setDisabled(currPage === pageCount || isEmpty);
            pageNumber && pageNumber.setDisabled(pageCount === 1 || isEmpty);
            pageCountCmp && pageCountCmp.setDisabled(false);
            pageSize && pageSize.setDisabled(isEmpty);
            refresh && refresh.setDisabled(refreshDisabled);
            countMessage && countMessage.setDisabled(false);

        },

        /**
         * 从分页输入字段获取页数
         * @param {分页数据} pageData 
         */
        readPageFromInput(pageData) {
            let field = this.getPageNumber(),
                pageNum = false,
                v;
            if (!field) return pageNum;
            v = field.getValue();
            pageNum = parseInt(v, 10);

            if (!v || isNaN(pageNum)) {
                field.setValue(pageData.currentPage);

                return false;
            }
            return pageNum;
        },


    },


    /**
     * 响应分页输入字段的键盘事件
     * @param {字段} sender 
     * @param {事件} e 
     */
    onPageNumberKeyUp(sender, e) {
        let me = this,
            key = e.getKey(),
            store = me.getStore(),
            pageData = me.getPageData(),
            increment = e.shiftKey ? 10 : 1,
            pageNum;

        if (key === e.RETURN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);

                if (pageNum !== pageData.currentPage) {
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
    onPageNumberBlur(sender, e) {
        let me = this,
            field = me.getPageNumber(),
            curPage = 0;
        if (!field) return;
        curPage = me.getPageData().currentPage;
        field.setValue(curPage);
    }



})
