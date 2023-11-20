Ext.define('Common.core.util.Format', {

    constructor() {
        Object.assign(Ext.util.Format, this.fn);
    },

    fn: {
        LF: '&#10;',
        emptyString: '\xA0',
        checkCls: 'x-checked',
        defaultPermissions: ['Create', 'Update', 'Delete'],
        getEpochTime() {
            return Math.floor(Ext.now() / 1000);
        },
        defaultValue2(v, defaultValue) {
            if (Ext.isEmpty(v)) return I18N.get(defaultValue);
            return v;
        },
        getEnumValue(v, name, isTextValue) {
            return Enums.getEnumText(v, name, I18N.get('None'), isTextValue);
        },
        langText(v) {
            return I18N.get(v);
        },
        dateTime(v) {
            return Format.date(v, Format.defaultDateTimeFormat);
        },
        date2(v) {
            return Format.date(v, Format.defaultDateFormat);
        },
        splitCamelCase(str, replace) {
            if (Ext.isEmpty(str)) return '';
            replace = replace ?? '-';
            return str.replace(/::/g, replace)
                .replace(/([A-Z]+)([A-Z][a-z])/g, `$1${replace}$2`)
                .replace(/([a-z\d])([A-Z])/g, `$1${replace}$2`)
                .toLowerCase();
        },
        toCamelCase(str, split){
            if (Ext.isEmpty(str)) return '';
            let words = str.split(split),
                result = '';
            Ext.each(words, (w)=>{
                if(Ext.isEmpty(result)){
                    result = w;
                }else{
                    result += Ext.String.capitalize(w);
                }
            })
            return result;
        },
        nullValueAndEditMessage(v) {
            let emptyText = I18N.get('NullValueAndEditMessage', 'ProductExtraFields');
            return Ext.isEmpty(v)
                ? emptyText
                : Ext.isDate(v) ? Format.date(v, Format.defaultDateTimeFormat) : v;
        },
        nullValueRedColor(v) {
            return Ext.isEmpty(v) ? 'text-danger' : '';
        },
        unDefine(v, values, field, hasDanger) {
            let me = this;
            if (Ext.isEmpty(v)) {
                let text = `[${I18N.get(Format.capitalize(field), me.getResourceName(), me.getEntityName())}]`;
                if (hasDanger) text = Format.getColorText(text, 'text-danger');
                return text;
            }
            return v;
        },
        separator(v) {
            return v ? ' > ' : '';
        },
        timeLimit(v, values) {
            let start = values.cardPeriodBegin || values.startTime,
                end = values.cardPeriodEnd || values.endTime;
            if (Ext.isString(start)) start = Ext.Date.parse(start, 'C');
            if (Ext.isString(end)) end = Ext.Date.parse(end, 'C');
            if (end.getFullYear() === 9999) return I18N.get('IsLongTerm');
            return Format.date2(start)
                + '~'
                + Format.date2(end);
        },
        schedule(v, values) {
            let minute = Format.scheduleItem(values.minute),
                hour = Format.scheduleItem(values.hour),
                week = Format.scheduleItem(values.week, 0, Ext.Date.dayNames),
                day = Format.scheduleItem(values.day, 1),
                month = Format.scheduleItem(values.month, 1, Ext.Date.monthNames);
            return `${minute} | ${hour} | ${week} | ${day} | ${month}`;
        },
        scheduleItem(v, start, textList) {
            let ln = v.length,
                text = [];
            start = start || 0;
            if (!v.includes('0')) {
                let end = start === 0 ? v.length - 1 : v.length;
                return `${textList && textList[0] || start}-${textList && textList[ln - 1] || end}`;
            };
            if (!v.includes('1')) return I18N.get('None');
            let skip = -1;
            for (let i = 0; i < ln; i++) {
                let c = v[i];
                if (i < skip) continue;
                if (c === '1') {
                    let last = v.indexOf('0', i);
                    //后续全部是1
                    if (last === -1) {
                        text.push(Format.calcSchedulePartText(i, start, ln, textList));
                        break;
                    }
                    text.push(Format.calcSchedulePartText(i, start, last, textList));
                    skip = last;
                }
            }
            return text.join(',');
        },
        calcSchedulePartText(index, start, last, textList) {
            let length = last - index;
            if (length === 1) {
                return Format.getScheduleItemText(index, index + start, textList);
            }
            if (length === 2) {
                return Format.getScheduleItemText(index, index + start, textList) +
                    ',' + Format.getScheduleItemText(index + 1, index + start + 1, textList);
            }
            return Format.getScheduleItemText(index, index + start, textList) +
                '-' + Format.getScheduleItemText(index + length - 1, index + start + length - 1, textList);
        },
        getScheduleItemText(index, v, textList) {
            return textList && textList[index] || v;
        },
        replaceChar(str, index, replace) {
            return str.substring(0, index) + replace + str.substring(index + 1)
        },
    },

    destroy() {
        this.destroyMembers('fn');
        this.callParent();
    }


}, function (Format) {
    Ext.create('Common.core.util.Format');
    window.Format = Ext.util.Format;
});