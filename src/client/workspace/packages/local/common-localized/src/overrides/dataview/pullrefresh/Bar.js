Ext.define("Common.overrides.dataview.pullrefresh.Bar", {
    override: "Ext.dataview.pullrefresh.Bar",

    config:{
        loadedText: 'LoadedText',
        loadingText: 'LoadingText',
        pullText: 'PullText',
        releaseText: 'ReleaseText',
        lastUpdatedText: 'LastUpdatedText'
    },

    privates: {
 
        updateLastUpdated: function(value) {
            var me = this,
                lastUpdated = value
                    ? I18N.get(me.getLastUpdatedText()) + Ext.util.Format.date(
                        value, Format.defaultDateTimeFormat,
                        Format.def
                    )
                    : value;
            me.infoUpdatedEl.setText(lastUpdated);
        },
 
        updateState: function(state) {
            var me = this,
                fn = me.textMap[state],
                text = fn && me[fn]();
            let langText = I18N.get(text);
            this.callParent(arguments);
            me.infoMessageEl.setText(langText || '');
 
        }
    }

});
