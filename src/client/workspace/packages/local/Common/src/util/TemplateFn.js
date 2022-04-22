Ext.define('Common.util.TemplateFn',{
    singleton: true,
    
    constructor(){
        Object.assign(Ext.util.Format, this.fn);
        window.Format = Ext.util.Format;
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
        gridHighlight(value, record, dataIndex, cell ,column){
            if(Ext.isEmpty(value)) return value;
            let values = record.data,
                store = column.up('grid').getStore(), 
                remoteFilter = store.getRemoteFilter(),
                field = record.fieldsMap[dataIndex],
                filter;
            if(remoteFilter || store.isTreeStore){
                let proxy = store.getProxy(),
                    params = proxy.extraParams;
                filter = params && params.filter;
            }else{
                filter = store.filterValue;
            }
            if(Ext.isEmpty(filter)) return Format.translations(value, values, field);
            return Format.translations(String(value).replace(new RegExp('(' + filter + ')', "gi"), `<span style='color:red;'>$1</span>`), values, field);
        },
        listHighlight(value, values, dataIndex, defaultValue){
            if(Ext.isEmpty(value)) return Format.defaultValue2(value, defaultValue);
            let me = this,
                store = me.getStore && me.getStore() || me.up('grid').getStore() ,
                model = store.getModel(),
                field = model.fieldsMap[dataIndex],
                filter = Format.getFilter(me, store);
            if(Ext.isEmpty(filter)) return Format.translations(value, values, field);
            return Format.translations(String(value).replace(new RegExp('(' + filter + ')', "gi"), `<span style='color:red;'>$1</span>`), values, field);
        },
        getFilter(me, store){
            let filter;
            if(me.xtype === 'boundlist'){
                let filters = store.getFilters().items,
                    find = filters[0];
                filter = find && find._value ;                
            }else{
                let filters = store.getFilters().items;
                if(filters.length>0){
                    filter = store.filterValue;
                }else{
                    let proxy = store.getProxy(),
                    params = proxy.extraParams;
                    filter = params && params.filter;
                }
            }
            return filter;
        },
        translations(value, values, field){
            if(!field.isTranslation) return value;
            let translations = values.translations,
                isPhone = Ext.platformTags.phone;
                cls = isPhone ? 'text-primary' : '',
                tips = [];
            if(!Ext.isArray(translations)) return value;
            if(!isPhone){
                Ext.iterate(translations,t=>{
                    let cultureName = t.language,
                        language = I18N.getLanguage(cultureName),
                        text = t[field.name] || I18N.get('None');
                    language && tips.push(`${language.displayName}: ${text}`);
                })    
            }
            return `<div class="w-100 translations ${cls}" title="${tips.join(Format.LF)}">${value}</div>`;

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
        checkbox(v){
            let check = v ? Format.checkCls : '';
            return Format.format(Template.checkBoxItem, v, '', check);
        },
        listCheckbox(v, field){
            if(v === null) return '';
            let check = v ? 'x-checked' : '';
            let resourceName = Format.getResourceName(this),
                name = I18N.get(Format.capitalize(field), resourceName, this.getEntityName());
            return `<div class="x-checkboxfield ${check} float-left"><span class=" x-icon-el ${field}"></span></div> ${name}`;         
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
            'account': true
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
        localized(v, langText, resourceName){
            langText = Format.capitalize(langText);
            return I18N.get(langText, resourceName || this.resourceName);
        },
        getColorByValue(v,danger, waring, normalCls){
            return v < danger ? 'text-danger' : v < waring ? 'text-warning' : (normalCls || '');
        },
        getColorText(v, cls, hasBrackets){
            if(hasBrackets) v= `[${v}]`;
            return `<span class="${cls}">${v}</span>`;
        },
        plaintext2Html(v){
            if(Ext.isEmpty(v)) return I18N.get('None');
            v = Ext.String.htmlEncode(v).replace(/\n+/g, '\n');
            return '<p class="text-indent m-0 p-0 lh-20">' + v.replace(/\n/g, '</p><p class="text-indent m-0 p-0 lh-20">') + '</p>';
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
        checkTargetCls(location, cls){
            let target = location.sourceElement || location;
            if(!target) return false;
            let classList = target.classList.value;
            if(Ext.isEmpty(classList)) return false;
            if(!Ext.isArray(cls)) return classList.includes(cls);
            let includes = false;
            Ext.each(cls,(c)=>{
                if(!classList.includes(c)) return;
                includes = c;
                return false;
            })
            return includes;
        },
        dateTimeToCheckbox(v, field){
            let checked = !!v,
                checkedCls = checked ?  Format.checkCls : '',
                text = v ? Format.dateTime(v) : '';
            return Format.format(Template.checkBoxItem, v, text, checkedCls, field);
        },
        getListItem(label,text,cls, id, field, inputType ){
            return `<div class="d-flex px-2 py-2">
                <div class="fw-bolder text-dark " style="width:150px;">${label}</div>
                <div class="flex-fill text-black-50 text-right ${cls} " data-field="${field}" data-type="${inputType}" data-id="${id}">
                    ${text}
                </div>
            </div>`
        }
    },

});