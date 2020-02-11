Ext.define('Common.Overrides.shared.panel.TimeHeader', {
    override: 'Ext.panel.TimeHeader',

    template: [{
        reference: 'headerEl',
        cls: Ext.baseCSSPrefix + 'header-el',
        children: [{
            reference: 'timeEl',
            cls: Ext.baseCSSPrefix + 'time-wrapper-el',
            children: [{
                cls: Ext.baseCSSPrefix + 'time-el ' + Ext.baseCSSPrefix + 'hour-el',
                reference: 'hoursEl',
                listeners: {
                    click: 'onHoursClick'
                }
            }, {
                cls: Ext.baseCSSPrefix + 'time-el',
                html: ':'
            }, {
                cls: Ext.baseCSSPrefix + 'time-el ' + Ext.baseCSSPrefix + 'minute-el',
                reference: 'minutesEl',
                listeners: {
                    click: 'onMinutesClick'
                }
            }]
        }, {
            reference: 'meridiemEl',
            cls: Ext.baseCSSPrefix + 'meridiem-wrapper-el',
            children: [{
                cls: Ext.baseCSSPrefix + 'am-el ' + Ext.baseCSSPrefix + 'meridiem-el',
                reference: 'amEl',
                html: I18N.AM,
                listeners: {
                    click: 'onAmClick'
                }
            }, {
                cls: Ext.baseCSSPrefix + 'pm-el ' + Ext.baseCSSPrefix + 'meridiem-el',
                reference: 'pmEl',
                html: I18N.PM,
                listeners: {
                    click: 'onPmClick'
                }
            }]
        }]
    }],

});