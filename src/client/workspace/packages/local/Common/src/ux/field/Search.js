Ext.define('Common.ux.field.Search', {
    extend: 'Ext.field.Search',
    xtype: 'uxsearchfield',

    config:{
        searchHandler: 'onSearch',
        remote : true
    },

    langPlaceholder: 'Search',
    autoLabel: false,

});