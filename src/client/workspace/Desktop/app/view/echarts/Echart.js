Ext.define('Desktop.view.echarts.Echart', {
    extend: 'Ext.Container',
    xtype : 'echartview', 
    
    requires:[
        'EChart.Component',
        'Desktop.view.echarts.EchartModel',
    ],

    layout: {
        type: 'box',
        wrap: 'wrap',
    },

    viewModel: 'desktop-echartmodel',
    defaults:{
        width: '50%',
        height: '50%'
    },
    defaultListenerScope: true,

    items: [
        {
            xtype: 'toolbar',
            docked: 'top',
            width: '100%',
            height: 'auto',
            items:[
                {
                    iconCls: 'x-fa fa-redo',
                    handler: 'onDataRefresh',
                    ui: 'action'
                }
            ]
        },
        {
            xtype: 'echartcomponent',
            bind: { store: '{sales}'},            
            //flex:1,
            // title: {
            //     text: '堆叠区域图'
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {},
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '邮件营销',
                    type: 'line',
                    //stack: '总量',
                    //areaStyle: {},
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    //stack: '总量',
                    //areaStyle: {},
                },
                {
                    name: '视频广告',
                    type: 'line',
                    //stack: '总量',
                    //areaStyle: {},
                },
                {
                    name: '直接访问',
                    type: 'line',
                    //stack: '总量',
                    //areaStyle: {},
                },
                {
                    name: '搜索引擎',
                    type: 'line',
                    //stack: '总量',
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'top'
                    //     }
                    // },
                    // areaStyle: {},
                }
            ]
        },
        {
            xtype: 'echartcomponent',
            //flex:1,
            // width: '50%',
            // height: '50%',
            bind: { store: '{sales}'},            
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '邮件营销',
                    type: 'bar',
                },
                {
                    name: '联盟广告',
                    type: 'bar',
                    stack: '广告',
                },
                {
                    name: '视频广告',
                    type: 'bar',
                    stack: '广告',
                },
                {
                    name: '直接访问',
                    type: 'bar',
                    stack: '广告',
                },
                {
                    name: '搜索引擎',
                    type: 'bar',
                    markLine: {
                        lineStyle: {
                            type: 'dashed'
                        },
                        data: [
                            [{type: 'min'}, {type: 'max'}]
                        ]
                    }
                },
            ]            
        },
        {
            xtype: 'echartcomponent',
            bind: { store: '{sales}'}, 
            legend: {},
            series: [
                {
                    name: '邮件营销',
                    type: 'pie',
                    radius: '15%',
                    center: [ '20%', '25%'],
                    dimensions:[
                        {name: 'name', type: 'ordinal'},
                        'mail',
                    ],
                },
                {
                    name: '联盟广告',
                    radius: '15%',
                    type: 'pie',
                    center: [ '75%', '25%'],
                    dimensions:[
                        {name: 'name', type: 'ordinal'},
                        'ad',
                    ],
                },
                {
                    name: '视频广告',
                    radius: '15%',
                    type: 'pie',
                    center: [ '50%', '50%'],
                    dimensions:[
                        {name: 'name', type: 'ordinal'},
                        'videoAd',
                    ],
                },
                {
                    name: '直接访问',
                    radius: '15%',
                    type: 'pie',
                    center: [ '20%', '75%'],
                    dimensions:[
                        {name: 'name', type: 'ordinal'},
                        'direct',
                    ],
                },
                {
                    name: '搜索引擎',
                    radius: '15%',
                    type: 'pie',
                    center: [ '75%', '75%'],
                    dimensions:[
                        {name: 'name', type: 'ordinal'},
                        'search',
                    ],
                },
            ]            
        },

    ],

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(1000));
    },
      
    name: ['周一', '周二','周三','周四','周五','周六','周日'],
    onDataRefresh(){
        let me = this,
            store = me.getViewModel().getStore('sales'),
            data = [];
        for (let i = 0; i < 7; i++) {
            data.push({
                name : me.name[i],
                mail: me.getRandomInt(),
                ad: me.getRandomInt(),
                videoAd: me.getRandomInt(),
                direct: me.getRandomInt(),
                search: me.getRandomInt(),
            });
        }
        store.loadData(data);
    },

    onViewHidden(sender, value){
        if(value) return;
        this.onDataRefresh();
    },

    listeners:{
        hiddenchange: 'onViewHidden'
    }

});