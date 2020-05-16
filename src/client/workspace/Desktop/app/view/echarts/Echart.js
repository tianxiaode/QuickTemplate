Ext.define('Desktop.view.echarts.Echart', {
    extend: 'Ext.Container',
    xtype : 'echartview', 
    
    requires:[
        'EChart.Component',
        'Desktop.view.echarts.EchartModel',
    ],

    layout: {
        type: 'box',
        wrap: false,

    },

    viewModel: 'desktop-echartmodel',

    items: [
        {
            xtype: 'echartcomponent',
            bind: { store: '{sales}'},            
            width: '50%',
            height: '50%',
            title: {
                text: '堆叠区域图'
            },
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
                    field: 'name'
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
                    stack: '总量',
                    //areaStyle: {},
                    field: 'mail',
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    stack: '总量',
                    //areaStyle: {},
                    field: 'ad',
                },
                {
                    name: '视频广告',
                    type: 'line',
                    stack: '总量',
                    //areaStyle: {},
                    field: 'videoAd'
                },
                {
                    name: '直接访问',
                    type: 'line',
                    stack: '总量',
                    //areaStyle: {},
                    field: 'direct',
                },
                {
                    name: '搜索引擎',
                    type: 'line',
                    stack: '总量',
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'top'
                    //     }
                    // },
                    // areaStyle: {},
                    field: 'search'
                }
            ]
        },
        // {
        //     xtype: 'echartcomponent',
        //     width: '50%',
        //     height: '50%',
        // },
        // {
        //     xtype: 'echartcomponent',
        //     width: '50%',
        //     height: '50%',
        // },
        // {
        //     xtype: 'echartcomponent',
        //     width: '50%',
        //     height: '50%',
        // }
    ]
});