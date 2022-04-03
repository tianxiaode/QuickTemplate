Ext.define('Common.util.TemplateFn',{
    singleton: true,
    
    constructor(){
        Object.assign(Ext.util.Format, this.fn);
        window.Format = Ext.util.Format;
    },

    fn:{
        emptyString: '\xA0',
        checkCls: 'x-checked',
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
        districtPostcode(value, record, dataIndex, cell ,column){
            if(!Ext.isNumeric(value)) return '';
            return Format.girdHighlight(value, record, dataIndex, cell ,column);
        },
        getTranslationText(origin, translation , fieldName, onlyTranslationValue){
            if(!translation || !fieldName) return origin;
            let  translationText = translation[fieldName],
                text = translationText ? 
                onlyTranslationValue ? translationText : `${translationText}(${origin})`
                : origin;
            return text;
        },
        girdHighlight(value, record, dataIndex, cell ,column){
            if(Ext.isEmpty(value)) return value;
            let store = column.up('grid').getStore(), 
                remoteFilter = store.getRemoteFilter();
                msg = Format.getTranslationText(value, record.get('translation'), dataIndex);
            if(remoteFilter){
                let proxy = store.getProxy(),
                params = proxy.extraParams,
                filter = params && params.filter;
                if(!filter) return msg;
                if(!Ext.isString(msg)) msg = msg.toString();                
                return msg.replace(new RegExp('(' + filter + ')', "gi"), '<span class="text-danger">$1</span>');
            }else{
                let filter = store.filterValue;
                if(Ext.isEmpty(filter)) return msg;
                return msg.replace(new RegExp('(' + filter + ')', "gi"), '<span class="text-danger">$1</span>');
            }
        },
        tristateCheckBox(v){
            if(v === null) return '';
            let check = v ? Format.checkCls : '';
            return `<div class="x-checkcell ${check}"><div class="x-checkbox-el x-font-icon"></div></div>`;
        },
        listHighlight(v, values, fieldName, defaultValue){
            if(Ext.isEmpty(v)) return Format.defaultValue2(v, defaultValue);
            let me = this,
                store = me.getStore && me.getStore() || me.up('grid').getStore() ,
                filter = null;
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
                    filter = params && params.query;
                }
            }
            if(!Ext.isString(v)) v = v.toString();
            let text =Format.getTranslationText(v, values && values.translation, fieldName);   
            if(!filter) return text;    
            return text.replace(new RegExp('(' + filter + ')', "gi"), '<span style="color:red;">$1</span>');
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
            return `<div class="x-checkcell ${check}"><div class="x-checkbox-el x-font-icon"></div></div>`;
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
        image(v){
            let me = this,
                id = Ext.id('image','listImage'),
                holder = URI.getResource('holder'),
                url = Ext.isEmpty(v) ? holder : URI.crud('File', v),
                img = new Image();
            img.onload=function(){
                let el = me.el && me.el.down('#'+id);                
                if(el) el.appendChild(img);
            };
            img.onerror=function(){
                let el = me.el && me.el.down('#'+id);
                console.log(el)
                img.src = holder;
                if(el) el.appendChild(img);
            };
            img.src = url;
            return id;
        },
        nullValueAndEditMessage(v){
            let emptyText = I18N.get('NullValueAndEditMessage', 'ProductExtraFields');
            return Ext.isEmpty(v) 
                ? emptyText
                : Ext.isDate(v) ? Format.date(v, Format.defaultDateTimeFormat) : v;
        },
        nullValueColor(v){
            return Ext.isEmpty(v) ? 'text-black-50': '';
        },
        nullValueRedColor(v){
            return Ext.isEmpty(v) ? 'text-danger': '';
        },
        price(v, values){
            return Format.currency(v/100);
        },
        detailRow(v, name, format, values){
            let entityName = Format.getEntityName(this),
                resourceName = Format.getResourceName(this);                
                label = I18N.get(Format.capitalize(name), resourceName, entityName);
            if(Ext.isObject(v)){
                let fileName = format;
                return Ext.String.format(Template.row, label, Format.translationItem(v[fileName],v,fileName), 4, 8 );
            }
            if(Ext.isString(format) && Format[format]) {
                v = format === 'translationItem'
                    ? Format.translationItem(v, values, name)
                    : Format[format].apply(null, [v,values]);
            };
            return Ext.String.format(Template.row, label, v, 4, 8 );
        },
        unDefine(v, values, field, hasDanger){
            if(Ext.isEmpty(v)){
                let text = `[${I18N.get(Format.capitalize(field), Format.getResourceName(this), Format.getEntityName(this))}]`;
                if(hasDanger) text = Format.getColorText(text, 'text-danger');
                return text;
            }
            if(Ext.isObject(v) && (field.toLowerCase() === 'Industry'.toLowerCase() || field.toLowerCase() === 'CargoType'.toLowerCase())){
                return Format.translationItem(v.displayName,v, 'displayName');
            }
            return values && field ? Format.translationItem(v,values, field) : v;
        },
        translationItem(v,values,field){
            if(values.translation && values.translation[field]) v = values.translation[field];
            return v;
        },
        getTranslationObjectText(v){
            if(!v) return '';
            return Format.getTranslationText(v.displayName, v.translation, 'displayName');
        },
        separator(v){
            return v ? ' > ' : '';
        },
        localized(v, langText, resourceName){
            langText = Format.capitalize(langText);
            return I18N.get(langText, resourceName || this.resourceName);
        },
        getResourceName(me){
            return me.resourceName
            || (me.getViewModel && me.getViewModel() && me.getViewModel().get('resourceName'))
            || (me.getContainerResourceName && me.getContainerResourceName());
        },
        getEntityName(me){
            return me.entityName
                || (me.getViewModel && me.getViewModel() && me.getViewModel().get('entityName'));
        },
        signalStrength(value,values){
            let online = values.isOnline,
                 width = '100%';
            return online 
                ? `<div class="signal"><div class="inner" style="width:${width}"><span class="fi md-icon-signal-cellular-4-bar text-success"></span></div></div>`
                : '<span style="font-size: 1.5em;" class="fi md-icon-signal-cellular-connected-no-internet-4-bar text-danger"></span>';
        },
        bindTime(v){
            return Ext.isEmpty(v) ? `[${Format.getDeviceLocaleText('WoEasy.DeviceManagement:001004')}]`
                : Format.dateTime(v);
        },
        district(v){     
            if(!v || Ext.isEmpty(v.displayName)) return `[${I18N.get('District', "Districts")}]`;
            let text = `${v.displayName}`;
            let parent = v.parent;
            if(!parent || Ext.isEmpty(parent.displayName)) return text;
            text = `${parent.displayName} ${text}`;
            let province = parent.parent;
            if(!province || Ext.isEmpty(province.displayName) || province.code.length === 5) return text;
            text = `${province.displayName} ${text}`;
            // let text = `${v.parent.displayName} ${v.displayName}`;
            // if(v.code.length === 23) {
            //     let province = District.getProvince(v.parent.parentId);
            //     text = province.get('displayName') + ' ' + text;
            // } 
            return text;
        },
        getColorByValue(v,danger, waring, normalCls){
            return v < danger ? 'text-danger' : v < waring ? 'text-warning' : (normalCls || '');
        },
        getColorText(v, cls, hasBrackets){
            if(hasBrackets) v= `[${v}]`;
            return `<span class="${cls}">${v}</span>`;
        },
        boolValue(v){
            return `<span class="x-fa fa-${v ? 'check' : 'times'} ${v ? 'text-success' : 'text-danger'}"></span>`        
        },
        iotExtraProperties(v){
            return `${I18N.get('ExtraProperties', 'IotService', 'IotMessage')}: ${Ext.encode(v)}`;
        },
        plaintext2Html(v){
            if(Ext.isEmpty(v)) return I18N.get('None');
            v = Ext.String.htmlEncode(v).replace(/\n+/g, '\n');
            return '<p class="text-indent m-0 p-0 lh-20">' + v.replace(/\n/g, '</p><p class="text-indent m-0 p-0 lh-20">') + '</p>';
        },
        textWithLabel(text, label){
            let labelSeparator = I18N.get('LabelSeparator');
            return `<span>${label}${labelSeparator}</span>${text}`;
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
        translations(v, values, field){
            let current = I18N.getCurrentLanguage(),
                find = (values.translations || []).find(t=>t.language === current);
            return find && `- ${find[field]}` || '';
        }
    },

});