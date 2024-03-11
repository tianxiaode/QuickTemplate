Ext.define('Common.ux.dataview.Format',{
    extend: 'Common.core.util.Format',
    singleton: true,

    fn:{
        // defaultValue2(v, defaultValue) {
        //     if (Ext.isEmpty(v)) return I18N.get(defaultValue);
        //     return v;
        // },
        // getEnumValue(v, name, isTextValue) {
        //     return Enums.getEnumText(v, name, I18N.get('None'), isTextValue);
        // },
        // langText(v) {
        //     return I18N.get(v);
        // },
        // dateTime(v) {
        //     return Format.date(v, Format.defaultDateTimeFormat);
        // },
        // date2(v) {
        //     return Format.date(v, Format.defaultDateFormat);
        // },
        // nullValueAndEditMessage(v) {
        //     let emptyText = I18N.get('NullValueAndEditMessage', 'ProductExtraFields');
        //     return Ext.isEmpty(v)
        //         ? emptyText
        //         : Ext.isDate(v) ? Format.date(v, Format.defaultDateTimeFormat) : v;
        // },
        // nullValueRedColor(v) {
        //     return Ext.isEmpty(v) ? 'text-danger' : '';
        // },
        // unDefine(v, values, field, hasDanger) {
        //     let me = this;
        //     if (Ext.isEmpty(v)) {
        //         let text = `[${I18N.get(Format.capitalize(field), me.getResourceName(), me.getEntityName())}]`;
        //         if (hasDanger) text = Format.getColorText(text, 'text-danger');
        //         return text;
        //     }
        //     return v;
        // },
        // separator(v) {
        //     return v ? ' > ' : '';
        // },
        // timeLimit(v, values) {
        //     let start = values.cardPeriodBegin || values.startTime,
        //         end = values.cardPeriodEnd || values.endTime;
        //     if (Ext.isString(start)) start = Ext.Date.parse(start, 'C');
        //     if (Ext.isString(end)) end = Ext.Date.parse(end, 'C');
        //     if (end.getFullYear() === 9999) return I18N.get('IsLongTerm');
        //     return Format.date2(start)
        //         + '~'
        //         + Format.date2(end);
        // },
        // schedule(v, values) {
        //     let minute = Format.scheduleItem(values.minute),
        //         hour = Format.scheduleItem(values.hour),
        //         week = Format.scheduleItem(values.week, 0, Ext.Date.dayNames),
        //         day = Format.scheduleItem(values.day, 1),
        //         month = Format.scheduleItem(values.month, 1, Ext.Date.monthNames);
        //     return `${minute} | ${hour} | ${week} | ${day} | ${month}`;
        // },
        // scheduleItem(v, start, textList) {
        //     let ln = v.length,
        //         text = [];
        //     start = start || 0;
        //     if (!v.includes('0')) {
        //         let end = start === 0 ? v.length - 1 : v.length;
        //         return `${textList && textList[0] || start}-${textList && textList[ln - 1] || end}`;
        //     };
        //     if (!v.includes('1')) return I18N.get('None');
        //     let skip = -1;
        //     for (let i = 0; i < ln; i++) {
        //         let c = v[i];
        //         if (i < skip) continue;
        //         if (c === '1') {
        //             let last = v.indexOf('0', i);
        //             //后续全部是1
        //             if (last === -1) {
        //                 text.push(Format.calcSchedulePartText(i, start, ln, textList));
        //                 break;
        //             }
        //             text.push(Format.calcSchedulePartText(i, start, last, textList));
        //             skip = last;
        //         }
        //     }
        //     return text.join(',');
        // },
        // calcSchedulePartText(index, start, last, textList) {
        //     let length = last - index;
        //     if (length === 1) {
        //         return Format.getScheduleItemText(index, index + start, textList);
        //     }
        //     if (length === 2) {
        //         return Format.getScheduleItemText(index, index + start, textList) +
        //             ',' + Format.getScheduleItemText(index + 1, index + start + 1, textList);
        //     }
        //     return Format.getScheduleItemText(index, index + start, textList) +
        //         '-' + Format.getScheduleItemText(index + length - 1, index + start + length - 1, textList);
        // },
        // getScheduleItemText(index, v, textList) {
        //     return textList && textList[index] || v;
        // },
        // replaceChar(str, index, replace) {
        //     return str.substring(0, index) + replace + str.substring(index + 1)
        // },
        // listHighlight(value, values, dataIndex, defaultValue){
        //     if(Ext.isEmpty(value)) return Format.defaultValue2(value, defaultValue);
        //     let me = this,
        //         store = me.getStore && me.getStore() || me.up('grid').getStore() ,
        //         model = store.getModel(),
        //         field = model.fieldsMap[dataIndex],
        //         filter = Format.getFilter(me, store);
        //     if(Ext.isEmpty(filter)) return Format.translations(value, values, field);
        //     return Format.translations(String(value).replace(new RegExp('(' + filter + ')', "gi"), `<span style='color:red;'>$1</span>`), values, field);
        // },
        // getFilter(me, store){
        //     let filter;
        //     if(me.xtype === 'boundlist'){
        //         let filters = store.getFilters().items,
        //             find = filters[0];
        //         filter = find && find._value ;                
        //     }else{
        //         let filters = store.getFilters().items;
        //         if(filters.length>0){
        //             filter = store.filterValue;
        //         }else{
        //             let proxy = store.getProxy(),
        //             params = proxy.extraParams;
        //             filter = params && params.filter;
        //         }
        //     }
        //     return filter;
        // },
        // translations(value, values, field){
        //     if(!field.isTranslation) return value;
        //     let translations = values.translations,
        //         isPhone = Ext.platformTags.phone;
        //         cls = isPhone ? 'text-primary' : '',
        //         tips = [];
        //     if(!Ext.isArray(translations)) return value;
        //     if(!isPhone){
        //         Ext.iterate(translations,t=>{
        //             let cultureName = t.language,
        //                 language = I18N.getLanguage(cultureName),
        //                 text = t[field.name] || I18N.get('None');
        //             language && tips.push(`${language.displayName}: ${text}`);
        //         })    
        //     }
        //     return `<div class="w-100 translations ${cls}" title="${tips.join(Format.LF)}">${value}</div>`;

        // },
        // checkbox(v){
        //     let check = v ? Format.checkCls : '';
        //     return Format.format(Template.checkBoxItem, v, '', check);
        // },
        // listCheckbox(v, field){
        //     if(v === null) return '';
        //     let check = v ? 'x-checked' : '';
        //     let resourceName = Format.getResourceName(this),
        //         name = I18N.get(Format.capitalize(field), resourceName, this.getEntityName());
        //     return `<div class="x-checkboxfield ${check} float-left"><span class=" x-icon-el ${field}"></span></div> ${name}`;         
        // },
        // localized(v, langText, resourceName){
        //     langText = Format.capitalize(langText);
        //     return I18N.get(langText, resourceName || this.resourceName);
        // },
        // getColorByValue(v,danger, waring, normalCls){
        //     return v < danger ? 'text-danger' : v < waring ? 'text-warning' : (normalCls || '');
        // },
        // getColorText(v, cls, hasBrackets){
        //     if(hasBrackets) v= `[${v}]`;
        //     return `<span class="${cls}">${v}</span>`;
        // },
        // plaintext2Html(v){
        //     if(Ext.isEmpty(v)) return I18N.get('None');
        //     v = Ext.String.htmlEncode(v).replace(/\n+/g, '\n');
        //     return '<p class="text-indent m-0 p-0 lh-20">' + v.replace(/\n/g, '</p><p class="text-indent m-0 p-0 lh-20">') + '</p>';
        // },
        // checkTargetCls(location, cls){
        //     let target = location.sourceElement || location;
        //     if(!target) return false;
        //     let classList = target.classList.value;
        //     if(Ext.isEmpty(classList)) return false;
        //     if(!Ext.isArray(cls)) return classList.includes(cls);
        //     let includes = false;
        //     Ext.each(cls,(c)=>{
        //         if(!classList.includes(c)) return;
        //         includes = c;
        //         return false;
        //     })
        //     return includes;
        // },
        // getListItem(label,text,cls, id, field, inputType ){
        //     return `<div class="d-flex px-2 py-2">
        //         <div class="fw-bolder text-dark " style="width:150px;">${label}</div>
        //         <div class="flex-fill text-black-50 text-right ${cls} " data-field="${field}" data-type="${inputType}" data-id="${id}">
        //             ${text}
        //         </div>
        //     </div>`
        // },
        gridHighlight(value, store){
            if(Ext.isEmpty(value)) return value;
            let remoteFilter = store.getRemoteFilter(),
                filter;
            if(remoteFilter || store.isTreeStore){
                let proxy = store.getProxy(),
                    params = proxy.extraParams;
                filter = params && params.filter;
            }else{
                filter = store.filterValue;
            }
            if(Ext.isEmpty(filter)) return value;
            return Format.highlight(value, filter);
        },
        highlight(value,filter){
            return String(value).replace(new RegExp('(' + filter + ')', "gi"), `<span class="color-alert"'>$1</span>`);
        }
    }
});