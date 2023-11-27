Ext.define('Desktop.view.echarts.EchartModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.desktop-echartmodel',
    stores: {
        sales:{
            fields:[ 'name', 'mail', 'ad', 'videoAd', 'direct', 'search'],

        },
    },
    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});