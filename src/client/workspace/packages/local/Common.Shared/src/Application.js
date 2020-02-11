/**
 * 封装了跨域Ajax的Application类
 */
Ext.define('Common.Shared.Application', {
    extend: 'Ext.app.Application',

    defaultToken: '',
    viewport: {
        controller: 'viewport',
    },

    init: function() {
        Ext.util.Format.defaultValue = function(value, defaultValue) {
            return Ext.isEmpty(value)
                ? Ext.isEmpty(defaultValue)
                    ? I18N.None
                    : defaultValue
                : value;
        };
        Ext.Msg.setScrollable('y');
        Ext.Msg.setMaxHeight(600);
        Ext.Msg.setMinWidth(300);
        Ext.Msg.setMaxWidth(800);
        Ext.Msg.applyMessage= function(config) {
            config = {
                maxHeight: 510,
                html: config,
                cls: this.baseCls + '-text'
            };
            return Ext.factory(config, Ext.Component, this._message);
        };
        Ext.Ajax.on('beforerequest', this.onAjaxBeforeRequest, this);
        Ext.Ajax.cors = true; 
    },

    onAppUpdate: function() {
        Ext.Msg.confirm(
            I18N.ApplicationUpdate,
            I18N.ApplicationUpdateMsg,
            function(choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            },
        );
    },

    onAjaxBeforeRequest: function(conn , options , eOpts ){
        if(!options.headers) options.headers = {}
        Ext.apply( options.headers, HEADERS.getHeaders());
    },

});
