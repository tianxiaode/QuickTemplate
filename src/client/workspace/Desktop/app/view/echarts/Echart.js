Ext.define('Desktop.view.echarts.Echart', {
    extend: 'Ext.Container',
    xtype : 'echartview', 
    
    requires:[
        'EChart.Component',
        'Desktop.view.echarts.EchartModel',
    ],

    layout: 'vbox',

    viewModel: 'desktop-echartmodel',

    items: [
        {
            xtype: 'echartcomponent',
            bind: { store: '{sales}'},            
            flex:1,
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
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    stack: '总量',
                    //areaStyle: {},
                },
                {
                    name: '视频广告',
                    type: 'line',
                    stack: '总量',
                    //areaStyle: {},
                },
                {
                    name: '直接访问',
                    type: 'line',
                    stack: '总量',
                    //areaStyle: {},
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
                }
            ]
        },
        {
            xtype: 'echartcomponent',
            flex:1,
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
                    name: '直接访问',
                    type: 'bar',
                },
                {
                    name: '邮件营销',
                    type: 'bar',
                    stack: '广告',
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