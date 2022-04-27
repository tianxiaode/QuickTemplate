Ext.define('Common.overrides.panel.DateView', {
    override: 'Ext.panel.DateView',

    constructor(config) {
        let me = this;
        me.callParent(arguments);
        if(I18N && I18N.isReady){
            me.onLocalized();
        }
        Ext.on('i18nready', me.onLocalized, me);
    },

    onLocalized(){
        let me = this;
        me.updateCaptionFormat(me.getCaptionFormat());
        me.updateStartDay(Ext.Date.firstDayOfWeek);
    },
 
    refresh: function() {
        var me = this,
            ExtDate = Ext.Date,
            cells = me.bodyCells,
            monthStart, startOffset, startDate, startDay, date,
            cellMap, cell, params, i, len, outPrev, outNext,
            currentMonth, month;

        // Calling getters might cause recursive refresh() calls, we don't want that
        if (me.refreshing) {
            return;
        }

        me.refreshing = true;

        monthStart = me.getMonth();
        startDay = me.getStartDay();
        startOffset = startDay - monthStart.getDay();

        if (startOffset > 0) {
            startOffset -= 7;
        }

        startDate = ExtDate.add(monthStart, ExtDate.DAY, startOffset);

        cellMap = me.cellMap = {};

        currentMonth = monthStart.getMonth();

        params = {
            today: Ext.Date.clearTime(new Date()),
            weekendDays: me.getWeekendDays(),
            specialDates: me.getSpecialDates(),
            specialDays: me.getSpecialDays(),
            format: me.getFormat(),
            dateCellFormat: me.getDateCellFormat(),
            hideOutside: me.getHideOutside()
        };

        for (i = 0, len = cells.length; i < len; i++) {
            cell = cells[i];

            date = ExtDate.add(startDate, ExtDate.DAY, i);

            month = date.getMonth();
            outPrev = month < currentMonth;
            outNext = month > currentMonth;

            cellMap[date.getTime()] = cell;

            params.cell = cell;
            params.date = date;

            params.outside = outPrev || outNext;
            params.outsidePrevious = outPrev;
            params.outsideNext = outNext;

            me.refreshCell(params);
        }

        me.captionElement.setHtml(Ext.Date.format(monthStart, me.getCaptionFormat()));

        me.refreshing = false;
    },

});
