Ext.define('EChart.Component', {
    extend: 'Ext.Component',
    xtype: 'echartcomponent',
   
    isEChart: true,

 
    requires: [
        'Ext.data.StoreManager',
        'Ext.data.Store'        
    ],    

    config: {
        store: 'ext-empty-store',
        title: null,
        legend: null,
        grid: null,
        xAxis: null,
        yAxis: null,
        polar: null,
        radiusAxis: null,
        angleAxis: null,
        radar: null,
        dataZoom: null,
        visualMap: null,
        tooltip: null,
        axisPointer: null,
        toolbox: null,
        brush: null,
        geo: null,
        parallel: null,
        parallelAxis: null,
        singleAxis: null,
        timeline: null,
        graphic: null,
        calendar: null,
        aria: null,
        series: null,
        color: null,
        backgroundColor: null,
        textStyle: null,
        dataset: null
    },

    defaultBindProperty: 'store',
    chartComponent: null,

    resizeDelay: 250, // in milliseconds
    resizeTimerId: 0,
    size: null, // cached size

    getTemplate: function() {
        return [{
            reference: 'innerElement',
            cls: Ext.baseCSSPrefix + 'inner-el',
            children: [{
                reference: 'bodyElement',
                cls: Ext.baseCSSPrefix + 'body-el',
                children: [
                    {
                        reference: 'chartElement',
                    }
                ]
            }]
        }];
    },

    constructor: function(config) {
        var me = this;

        me.callParent(arguments);
        me.on('painted', me.onPainted, me);
        me.on('resize', me.onElementResize, me);

    },



    applyStore: function(store) {
        return store && Ext.StoreManager.lookup(store);
    },
 
    updateStore: function(newStore, oldStore) {
        var me = this;
 
        if (oldStore && !oldStore.destroyed) {
            oldStore.un({
                datachanged: 'onDataChanged',
                update: 'onDataChanged',
                scope: me,
                order: 'after'
            });
 
            if (oldStore.autoDestroy) {
                oldStore.destroy();
            }
        }
 
        if (newStore) {
            newStore.on({
                datachanged: 'onDataChanged',
                update: 'onDataChanged',
                scope: me,
                order: 'after'
            });
        }


        me.fireEvent('storechange', me, newStore, oldStore);
        if(newStore.isLoaded())me.onDataChanged();
    },
 
  
    onDataChanged: function() {
        var me = this;
        me.redraw();
    },
     
    bindStore: function(store) {
        this.setStore(store);
    },


    redraw(){
        let me = this,
            store = me.getStore(),
            hasLoadedStore = store && store.isLoaded();
        if(!me.isInitializing || !hasLoadedStore) return;
        let option = {},
            data = [],
            prototype = Object.getPrototypeOf(me),
            config = Object.assign({}, prototype.config);
        store.each(record=>{
            data.push(Object.assign({}, record.data));
        })

        delete config.store;
        delete config.series;
        delete config.legend;
        delete config.dataset;

        let dataset = me.getDataset() || {};
        dataset.source = data;

        option.dataset = dataset;
        // delete config.xAxis;
        // delete config.yAxis;
        let series = me.getSeries(),
            legend = me.getLegend(),
            // xAxis = me.getXAxis(),
            // yAxis = me.getYAxis(),
            legendData = [];
        series.forEach(s=>{
            legendData.push(s.name);
            s.data = data[s.field];
            delete s.field;
        })
        option.series = series;
        if(legend !=null){
            legend.data = legendData;
            option.legend = legend;
        }

        let keys = Object.keys(config);
        keys.forEach(key=>{
            let fn = me[`get${Ext.util.Format.capitalize(key)}`];
            if(!fn) return;
            let value = fn.apply(me);
            if(!value) return;
            option[key] = value;
        })
        me.chartComponent.setOption(option);

    },

    

    handleResize: function(size, instantly) {
        var me = this,
            el = me.element;

        size = size || (el && el.getSize());

        if (!(size && size.width && size.height)) {
            return;
        }

        clearTimeout(me.resizeTimerId);

        if (instantly) {
            me.resizeTimerId = 0;
        }
        else {
            me.resizeTimerId = Ext.defer(me.handleResize, me.resizeDelay, me, [size, true]);

            return;
        }

        me.size = size;
        if(me.chartComponent) me.chartComponent.resize(size);
    },

    onElementResize: function(element, width ,height) {
        this.handleResize({width:width, height: height});
    },

    destroy: function() {
        var me = this;

        if(me.chartComponent){
            me.chartComponent.dispose();
        }

        delete me.chartComponent;

        me.setStore(null);

        if (me.hasListeners.destroy) {
            me.fireEvent('destroy', me);
        }
        me.un('resize', 'onElementResize', me);

        me.callParent();
    },

    onPainted(){
        var me = this;
 
        //me.callParent();
        me.chartComponent = echarts.init(me.chartElement.dom);
        me.isInitializing = true;
        me.redraw();
    },


});
