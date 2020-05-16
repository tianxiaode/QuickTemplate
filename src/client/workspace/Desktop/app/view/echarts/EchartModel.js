Ext.define('Desktop.view.echarts.EchartModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.desktop-echartmodel',
    stores: {
        sales:{
            fields:[ 'name', 'mail', 'ad', 'videoAd', 'direct', 'search'],

            data: function(){
                let data =[
                    ['周一', '周二','周三','周四','周五','周六','周日'],
                    [120, 132, 101, 134, 90, 230, 210],
                    [220, 182, 191, 234, 290, 330, 310],
                    [150, 232, 201, 154, 190, 330, 410],
                    [320, 332, 301, 334, 390, 330, 320],
                    [820, 932, 901, 934, 1290, 1330, 1320]
                    ],
                    result = [];
                for (let i = 0; i < 7; i++) {
                    result.push({
                        name: data[0][i],
                        mail: data[1][i],
                        ad: data[2][i],
                        videoAd: data[3][i],
                        direct: data[4][i],
                        search: data[5][i]
                    })
                }
                console.log(result)
                return result;
            }()            
        },
    },
    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});