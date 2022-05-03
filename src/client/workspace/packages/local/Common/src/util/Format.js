Ext.define('Common.util.Format',{
    
    constructor(){
        Object.assign(Ext.util.Format, this.fn);
    },

    fn:{
        LF: '&#10;',
        emptyString: '\xA0',
        checkCls: 'x-checked',
        defaultPermissions:['Create', 'Update', 'Delete'],
        b64DecodeUnicode(str) {
            const base64 = str.replace(/\-/g, '+').replace(/\_/g, '/');
            return decodeURIComponent(atob(base64)
                .split('')
                .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
                .join(''));
        },        
        base64UrlEncode(str) {
            const base64 = btoa(str);
            return base64
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        },
        defaultValue2(v, defaultValue){
            if(Ext.isEmpty(v)) return I18N.get(defaultValue);
            return v;
        },     
        getEnumValue(v, name, isTextValue){
            return Enums.getEnumText(v,name,I18N.get('None'), isTextValue);
        },
        langText(v){
            return I18N.get(v);
        },
        dateTime(v){
            return Format.date(v, Format.defaultDateTimeFormat);
        },
        date2(v){
            return Format.date(v, Format.defaultDateFormat);
        }, 
        pluralRules: [
            // [new RegExp('(m)an$', 'gi'),                 '$1en'],
            // [new RegExp('(pe)rson$', 'gi'),              '$1ople'],
            // [new RegExp('(child)$', 'gi'),               '$1ren'],
            // [new RegExp('^(ox)$', 'gi'),                 '$1en'],
            // [new RegExp('(ax|test)is$', 'gi'),           '$1es'],
            // [new RegExp('(octop|vir)us$', 'gi'),         '$1i'],
            // [new RegExp('(alias|status)$', 'gi'),        '$1es'],
            // [new RegExp('(bu)s$', 'gi'),                 '$1ses'],
            // [new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes'],
            // [new RegExp('([ti])um$', 'gi'),              '$1a'],
            // [new RegExp('sis$', 'gi'),                   'ses'],
            // [new RegExp('(?:([^f])fe|([lr])f)$', 'gi'),  '$1$2ves'],
            // [new RegExp('(hive)$', 'gi'),                '$1s'],
            [new RegExp('(^media$)', 'gi'),       '$1e'],
            [new RegExp('([^aeiouy]|qu)y$', 'gi'),       '$1ies'],
            // [new RegExp('(matr|vert|ind)ix|ex$', 'gi'),  '$1ices'],
            // [new RegExp('(x|ch|ss|sh)$', 'gi'),          '$1es'],
            // [new RegExp('([m|l])ouse$', 'gi'),           '$1ice'],
            // [new RegExp('(quiz)$', 'gi'),                '$1zes'],
            [new RegExp('s$', 'gi'),                     's'],
            [new RegExp('$', 'gi'),                      's']
        ],        
        uncountableWords: {
            'equipment': true,
            'information': true,
            'rice': true,
            'money': true,
            'species': true,
            'series':true,
            'fish':true,
            'sheep':true,
            'moose':true,
            'deer':true, 
            'news':true,
            'marketing': true,
            'caching': true,
            'account': true,
            'emailing': true
        },    
        pluralize(str){
            if(Ext.isEmpty(str)) return '';
            if(Format.uncountableWords[str.toLowerCase()]) return str;
            let rules = Format.pluralRules;
            for(var i = 0, l = rules.length; i < l; i++){
                if (str.match(rules[i][0])) {
                    str = str.replace(rules[i][0], rules[i][1]);
                    break;
                }
            }
        
            return str;
        },
        splitCamelCase(str){
            if(Ext.isEmpty(str)) return '';
            return str.replace(/::/g, '-')
                .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
                .replace(/([a-z\d])([A-Z])/g, '$1-$2')
                .toLowerCase();
        },
        mimeType:{
            jpg: 'image/jpeg',
            png: 'image/png',
            mp4: 'video/mp4',
            bin: 'application/octet-stream',
            csv: 'application/octet-stream',
            iso: 'application/octet-stream',
            zip: 'application/x-compressed',
            apk: 'application/vnd.android.package-archive',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            pdf: 'application/pdf',
        },
        getMimeTypeByFileName(filename){
            let index = filename.lastIndexOf('.'),
                ext = filename.substring(index+1);
            return Format.mimeType[ext];
        },
        nullValueAndEditMessage(v){
            let emptyText = I18N.get('NullValueAndEditMessage', 'ProductExtraFields');
            return Ext.isEmpty(v) 
                ? emptyText
                : Ext.isDate(v) ? Format.date(v, Format.defaultDateTimeFormat) : v;
        },
        nullValueRedColor(v){
            return Ext.isEmpty(v) ? 'text-danger': '';
        },
        unDefine(v, values, field, hasDanger){
            let me = this;
            if(Ext.isEmpty(v)){
                let text = `[${I18N.get(Format.capitalize(field), me.getResourceName(), me.getEntityName())}]`;
                if(hasDanger) text = Format.getColorText(text, 'text-danger');
                return text;
            }
            return v;
        },
        separator(v){
            return v ? ' > ' : '';
        },
        timeLimit(v,values){
            let start = values.cardPeriodBegin || values.startTime,
                end = values.cardPeriodEnd || values.endTime;
            if(Ext.isString(start)) start = Ext.Date.parse(start, 'C');
            if(Ext.isString(end)) end = Ext.Date.parse(end, 'C');
            if(end.getFullYear() === 9999) return I18N.get('IsLongTerm');
            return Format.date2(start)
                + '~'
                + Format.date2(end);
        },
        schedule(v, values){
            let minute = Format.scheduleItem(values.minute),
                hour = Format.scheduleItem(values.hour),
                week = Format.scheduleItem(values.week,0, Ext.Date.dayNames),
                day = Format.scheduleItem(values.day, 1),
                month = Format.scheduleItem(values.month, 1, Ext.Date.monthNames);
            return `${minute} | ${hour} | ${week} | ${day} | ${month}`;
        },
        scheduleItem(v, start, textList){
            let ln = v.length,
                text = [];
            start = start || 0;
            if(!v.includes('0')) {
                let end = start === 0 ? v.length -1 : v.length;
                return `${textList && textList[0] || start}-${textList && textList[ln-1] || end}`;
            };
            if(!v.includes('1')) return I18N.get('None');
            let skip = -1;
            for(let i=0;i<ln;i++){
                let c = v[i];
                if(i<skip) continue;
                if(c === '1'){
                    let last = v.indexOf('0', i);
                    //后续全部是1
                    if(last === -1){
                        text.push(Format.calcSchedulePartText(i,start,ln, textList));
                        break;
                    }
                    text.push(Format.calcSchedulePartText(i,start,last, textList));
                    skip = last;
                }        
            }
            return text.join(',');
        },
        calcSchedulePartText(index, start, last, textList ){
            let length = last- index;
            if(length === 1){
                return Format.getScheduleItemText(index, index+start, textList);                
            }
            if(length === 2){
                return Format.getScheduleItemText(index, index+start, textList) +
                    ',' + Format.getScheduleItemText(index+1, index+start+1, textList);
            }
            return Format.getScheduleItemText(index, index+start, textList) +
            '-' + Format.getScheduleItemText(index+length-1, index+start+length-1, textList);
        },
        getScheduleItemText(index, v, textList){
            return textList && textList[index] || v;
        },
        replaceChar(str, index, replace){
            return str.substring(0, index) + replace + str.substring(index + 1)
        },
    },

},function(Format){
    Ext.create('Common.util.Format');
    window.Format = Ext.util.Format;
});