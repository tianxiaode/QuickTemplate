Ext.define('Common.shared.util.TemplateFn',{
    singleton: true,
    
    constructor(){
        Object.assign(Ext.util.Format, this.fn);
        window.Format = Ext.util.Format;
    },

    fn:{
        emptyString: '\xA0',
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
        checkCls: 'x-checked',
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
                query = params && params.query;
                if(!query) return msg;
                if(!Ext.isString(msg)) msg = msg.toString();                
                return msg.replace(new RegExp('(' + query + ')', "gi"), '<span class="text-danger">$1</span>');
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
        organizationUnitName(v){
            return Ext.isEmpty(v) ? `[${I18N.get('OrganizationId', 'AbpIdentity')}]`  : I18N.get(v, 'AbpIdentity');
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
        goodsContainerCount(v, values){
            let containerCount = v.toString().length,
                emptyLineCount = values.emptyLineCount,
                emptyLineCountStr = emptyLineCount > 0 ? Format.getColorText(emptyLineCount,'text-danger') : emptyLineCount,
                emptyRate = values.defaultInventorySum == 0 ? 1 : values.inventorySum/values.defaultInventorySum,
                emptyRateColor = Format.getColorByValue(emptyRate, 0.3, 0.7),
                emptyRateStr = Format.getColorText(Format.percent(1 - emptyRate), emptyRateColor);
            return `${containerCount} | ${emptyLineCountStr}/${values.lineCount} | ${emptyRateStr}`;
        },
        deviceTill(v,values){
            if(!v) return Format.emptyString;
            let firstColor = Format.getColorByValue(values.coinsChangeCount1,10, 50),
                secondColor = Format.getColorByValue(values.coinsChangeCount2,10, 50),
                firstStr = Format.getColorText(values.coinsChangeCount1, firstColor),
                secondStr = Format.getColorText(values.coinsChangeCount2, secondColor);
            return `${values.paperChangeBalance} |  ${firstStr}(${values.coinsChangeValue1}) | ${secondStr}(${values.coinsChangeValue2})`;
        },
        paymentMethod(v){
            if(Ext.isEmpty(v)) return  Format.getColorText(Format.getDeviceLocaleText('PaymentMethods'), 'text-danger paymentMethods', true);
            if(Ext.isArray(v)){
                let text = '';
                v.forEach(m=>{
                    text+= `${Format.orderPayMethod(m)} `;
                });
                return text;
            }
            return v;
        },
        deviceCapability(v,values){
            let str = values.isSpring ? Format.getDeviceLocaleText('IsSpring') + ' | ' 
                : Format.getDeviceLocaleText('NonSpring') + ' | ';
            if(values.hasFacialRecognition) str += Format.getDeviceLocaleText('HasFacialRecognition') + ' | ';
            if(values.hasScreen) str += Format.getDeviceLocaleText('HasScreen') + ' | ';
            let length = str.length;
            return str.substring(0, length -3);
        },
        deviceErrors(v){
            return Ext.isEmpty(v) 
                ? Format.getColorText(Format.getDeviceLocaleText('NoErrors'), 'text-success')
                : Format.getColorText(v, 'text-danger');
        },
        getDeviceLocaleText(key){
            return I18N.get(key,'DeviceInfos'); 
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
        ageLimit(v){
            return v + I18N.get('YearOld')
        },
        shipmentStatus(v){
            let item = Enums.getEnumItem(v,'ShipmentStatus');
            if(!item) return v;
            let data = item.data;
            let cls = data.value === 1 ? 'text-success' : data.value === 2 ? 'text-danger' : 'text-info';
            return `<span class="${cls}">${data.text}</span>`
        },
        payStatus(v){
            let item = Enums.getEnumItem(v,'PayStatus');
            if(!item) return v;
            let data = item.data,
                cls = 'text-info';
            if(data.text.includes('成功')) cls = 'text-success';
            if(data.text.includes('失败')) cls = 'text-danger';
            return `<span class="${cls}">${data.text}</span>`

        },
        orderPayMethod(v){
            if(Ext.isEmpty(v)) return '[支付方法]';
            let item = null;
            Ext.Object.each(Enums.paymentMethod,(key,value)=>{
                if(key.toLowerCase() !== v.toLowerCase()) return true;
                item = value;
                return false;
            })
            return item ? item.text :  '[支付方法]';
        },
        promoCode(v,values){
            if(Ext.isEmpty(v)) return I18N.get('None') + I18N.get('PromoCode','Orders');
            let discount  = values.discount,
                discountStr = values.discountType === 1 ? Ext.util.Format.currency(discount) 
                : `${discount}%`;
            return  `${v},${discountStr}`;
        },
        cash(v,values){
            if(Ext.isEmpty(v)) return '';
            return v.toLowerCase() === Enums.paymentMethod.Cash.key.toLowerCase()
                ? `(${Ext.util.Format.currency(values.slotAmount)},${Ext.util.Format.currency(values.changeAmount)})`
                : ''
        },
        deliveryCode(v){
            if(Ext.isEmpty(v)) return '';
            return `(${v})`
        },
        discountAmount(v,values, fieldName){            
            let type = values[fieldName];
            return type === Enums.ledgerType.Cash.value ? 
                Format.currency(v) : `${v}%`;    
        },
        payee(v,values){
            let resourceName = 'OrderLedgers',
                label = I18N.get('PayeeName', resourceName),
                text = v;
            if(values.payeeId === 0) text = I18N.get('Buyer', resourceName);
            return Format.textWithLabel(text, label);
        },
        receiver(v,values){
            let resourceName = 'OrderLedgers',
                label = I18N.get('ReceiverName', resourceName),
                text = v;
            if(Ext.isEmpty(values) || values.payeeId === values.receiverId) {
                return Format.textWithLabel(text, label);
            }
            if(values.receiverId === 0) {
                text = I18N.get('Buyer', resourceName)
                return Format.textWithLabel(text, label);
            };
            let amount = values.ledgerType === Enums.ledgerType.Cash.value ? 
                    Ext.util.Format.currency(values.amountOfLedger) : 
                    values.ledgerType === Enums.ledgerType.Percent.value ?
                    `${values.amountOfLedger}%` : '100%';
            text = `${v}(${amount})`;
            return Format.textWithLabel(text, label);
        },
        textWithLabel(text, label){
            let labelSeparator = I18N.get('LabelSeparator');
            return `<span>${label}${labelSeparator}</span>${text}`;
        },
        receivedAmount(value, values){
            let isIncome = values.receiverId === Config.getCurrentUser().id,
                calValue = isIncome ? value : value * -1;
                amount = Format.currency(calValue),
                color = isIncome ? 'text-success' : 'text-danger';
            return `<span class="${color}">${amount}</span>`;
        },
        clearingType(v){
            return I18N.get(v, 'ClearingAccounts');
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
        statusText(color, text){
            return `<span class="${color}">${text}</span>`
        }, 
        clearingAccountBindStatus(v, values){
            let enums = Enums.clearingAccountBindStatus,
                statusText = '';
            if(v === enums.Success.value){
                return Format.statusText('text-success',enums.Success.text);                
            }
            if(v === Enums.clearingAccountBindStatus.Failure.value){
                statusText = enums.Failure.text;
                if(!Ext.isEmpty(values.error)) statusText += ` - ${values.error}`;
                return Format.statusText('text-danger', statusText);
                
            }
            if(v === Enums.clearingAccountBindStatus.None.value){
                statusText = Format.statusText('text-info', enums.None.text);
            }
            if(v === Enums.clearingAccountBindStatus.Pending.value){
                statusText = Format.statusText('text-info', enums.Pending.text);
            }
            statusText = Format.getEnumValue(v, 'ClearingAccountBindStatus');
            return Format.statusText('text-warning', statusText);
        },
        clearingAccountBase(v){
            if(!v) return;
            return `${v.aliasName}-${v.certName}`;
        },
        clearingAccountBank(v){
            if(!v) return;
            return `${v.accountNo}(${v.accountName})`;
        },
        licenseImage(v){
            if(Ext.isEmpty(v)) return Ext.BLANK_IMAGE_URL;
            return v;
        },
        isPayee(v, values){
            let amount = values.amount,
                amountText = '';
            if(v) {
                amountText = I18N.get('IsPayee', 'ClearingRules');
            }else{
                amountText = `${amount/1000}%`;
                if(values.pattern === Enums.clearingRulePattern.Cash.value) amountText = Format.currency(amount/1000);
            }
            let start = I18N.get('LongTerm', 'ClearingRules'),
                end = Format.emptyString,
                color = '';
            if(values.endTime.getFullYear() !== 9999 ) {
                let now = new Date(),
                    diff = Ext.Date.diff(now, values.endTime, Ext.Date.DAY);
                if(diff<=30) color = 'text-warning'
                if(diff<=0) color = 'text-danger';
                start = Format.date2(values.startTime);
                end = Format.date2(values.endTime);
            }; 
            if(Ext.platformTags.phone){
                if(end !== Format.emptyString) end = '~' + end;
                return `<div class="px-0 py-1"><span class="text-success">${amountText}</span> (<span class="${color}">${start}${end}</span>)</div>`;
            }
            return `<div class="px-0 py-1 text-success">${amountText}</div>
                    <div class="px-0 py-1 ${color}">${start}</div>
                    <div class="px-0 py-1 ${color}">${end}</div>
                    `;
        },
        organization(v){
            let text = v && v.displayName;
            return Ext.isEmpty(text) ? Ext.emptyString : text;
        },
        totalInventory(v, values){
            let number = Ext.isArray(values.columns) ? values.columns.length : 0;
            return `${v}(${values.inventoryInColumn}x${number})`;
        },
        productColumns(v){
            return Ext.isArray(v) ? v.length : 0;
        },
        fullInventory(v, values){
            if(!v || values.deviceProductId <= 0) return Format.emptyString;
             return `${Format.emptyString}
                 <span data-id="${values.id}" class="editor fullInventory text-primary cursor-pointer x-fa fa-fast-forward">                 
                 </span>${Format.emptyString}
            `
        },
        emptyInventory(v, values){
            if(!v || values.deviceProductId <= 0) return Format.emptyString;
             return `${Format.emptyString}
                 <span data-id="${values.id}" class="editor emptyInventory text-primary cursor-pointer x-fa fa-fast-backward">
                 </span>${Format.emptyString}
            `
        },
        display2Price(v){
            if(Ext.isEmpty(v)) return 0;
            return (v*100).toFixed(0);
        },
        display2Patten(v){
            if(Ext.isEmpty(v)) return 0;
            return (v.toFixed(1)*1000).toFixed(0);
        },
        editable(v, cls,  hidden){
            return v ? `${cls} text-primary cursor-pointer` : (hidden ? 'd' : '');
        },
        getColumnNo(storage, shelf, col){
            if(Ext.isString(col)) col = parseInt(col);
            return 1000000+ storage*10000 + shelf*100 + col;
        },
        deviceStorageHeader(v){
           let text = I18N.get('ShelfText', 'DeviceInfos');
           return Format.format(text, v);
        },
        inventoryColor(v, values){
            let total = values.totalInventory,
                per = total === 0 ? 0 : v / total;
            if(per <= values.waringThreshold / 100) return 'text-danger';
            if(per <= values.alertThreshold /100) return 'text-warning';
            return '';
        },
        columnProduct(v){
            return Ext.isEmpty(v) ? I18N.get('ColumnEmpty','DeviceInfos') : v;
        },
        columnState(v, values){
            let r = 'DeviceInfos',  
                color = `text-success`,
                text = I18N.get('ColumnIsOK', r);
            if(values.isClose) {
                color = 'text-warning';
                text = I18N.get("ColumnClose", r);
            } 
            if(values.isInactive) {
                color = 'text-warning';
                text = I18N.get("ColumnInactive", r);
            }
            if(values.isError) {
                color = 'text-danger';
                text = I18N.get("ColumnError", r) + ' - ' + values.error.join(',');
            }
            return `<span class="${color}">${text}</span>`;
        },
        removeProduct(v, values){
            if(!v || values.deviceProductId <= 0) return '';
            return `<span data-id="${values.id}" class="text-danger editor cursor-pointer removeProduct x-far fa-trash-alt" title='${I18N.get('RemoveProduct','DeviceInfos')}'></span>`;
        },
        addProduct(v, values){
            if(!v || values.isClose || values.isInactive) return '';
            return `<span data-id="${values.id}" class="text-primary editor cursor-pointer addProduct x-far fa-clone" title='${I18N.get('AddProduct','DeviceInfos')}'></span>`;
        },
        columnSpinnerEditor(v, values, field){
            if(values.deviceProductId <= 0) return Format.emptyString;
            let tpl = Template.spinnerEditor,
                text = Format.format(tpl, field, values[field], Format.editable(v, '',  true));
            return text;
        },
        productCount(v, values){
            let alertCount = values.alertCount,
                warningCount = values.warningCount,
                alertColor = alertCount > 0 ? 'text-warning' : '',
                warnColor = warningCount > 0 ? 'text-danger' : '';
            return `
                    <div class="col-4  text-center ${alertColor}">${alertCount}</div>
                    <div class="col-4  text-center ${warnColor}">${warningCount}</div>
                    <div class="col-4 text-center">${v}</div>
                `;
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
        marketingDiscountType(v, values){
            let text = Format.getEnumValue(v, 'MarketingDiscountType'),            
                enumItem = Enums.marketingDiscountType,
                amount = values.discountAmount /1000,
                quantity = values.quantity/100,
                amountText = v === enumItem.Percent.value || v === enumItem.Quantity.value ? `${amount}%` : Format.currency(amount),
                quantityText = v === enumItem.Full.value ? ',' + Format.currency(quantity)
                    : v === enumItem.Quantity.value ? ',' + quantity : '';
            return `${text}(${amountText}${quantityText})`;
            
        },
        enabledTime(v){
            if(Ext.isEmpty(v)) return `<span class="text-danger">${I18N.get('Disabled', 'Marketing')}</span>`;
            return Format.date2(v);
        },
        clearingPattern(v, values){
            let amount = `${values.amount/1000}%`;
            if(values.pattern === Enums.clearingRulePattern.Cash.value) amount = Format.currency(values.amount/1000);
            return amount;
        },
        editableFlag(v){
            if(!v) return '';
            return '<span class="x-fa fa-circle text-success"></span>';
        },
        erasableFlag(v){
            if(!v) return '';
            return '<span class="x-fa fa-times-circle text-danger"></span>';
        },
        iotMessageState(v, values){
            let states = Enums.iotMessageState,
                text, color;
            if(values.deviceSn === values.currentDeviceSn){
                text = Format.getEnumValue(v, 'IotMessageState', false),
                color = v === states.Received.value ? 'text-success'
                    : v === states.Failed.value ? 'text-danger'
                    : v === states.Sent.value ? 'text-info'
                    : '';
                return `<span class="${color}">${text}</span>`;
            }
            let received = values.extension && values.extension.received;
            if(Ext.isEmpty(received)) {
                text = states.Sent.text;
                color = 'text-info';
            }else{
                let exits = Ext.Array.findBy(received,(item)=>{
                    return item.DeviceSn = values.currentDeviceSn;
                });
                if(exits){
                    text = states.Received.text;
                    color = 'text-success';
                }else{
                    text = states.Sent.text;
                    color = 'text-info';
                };    
            }
            return `<span class="${color}">${text}</span>`;
        },
        iotMessageReceiveTime(v, values){
            if(values.deviceSn === values.currentDeviceSn) return Format.dateTime(v);
            let received = values.extension && values.extension.received;
            if(Ext.isEmpty(received)) return Format.emptyString;
            let exits = Ext.Array.findBy(received,(item)=>{
                return item.DeviceSn = values.currentDeviceSn;
            });
            if(!exits) return Format.emptyString;
            return Format.dateTime(exits.Received);
        },
        iotMessageData(v){
            let data = v && v.data;
            if(Ext.isEmpty(data)) return I18N.get('None');
            return Ext.encode(data);
        },
        columnNo(v){
            return v.toString().substring(1);
        },
        orderTime(v,values){
            let html = `
                    <div class="lh-20">${I18N.get('Paid', 'Orders')}: ${Format.dateTime(values.paidTime)}</div>
                    <div class="lh-20">${I18N.get('Shipped', 'Orders')}: ${Format.dateTime(values.shippedTime)}</div>
                    <div class="lh-20">${I18N.get('Refund', 'Orders')}: ${Format.dateTime(values.refundedTime)}</div>
                `;
            return html;
        },
        orderProduct(v , field){
            return v && v[field];
        },
        orderPayment(v, values){
            let html = Format.currency(values.paymentAmount);
            if(values.paymentMethod == Enums.paymentMethod.Cash.value){
                html+=`(${values.detail.slotAmount},${values.detail.changeAmount})`;
            }
            html+=` = ${Format.currency(values.total)} - ${Format.currency(values.discountAmount)}`;
            let promoCode= values.promoCode;
            if(Ext.isEmpty(promoCode)) return html;
            let type = values.detail.discountType,
                amount = values.detail.discountAmount;
            if(type === Enums.marketingDiscountType.Percent.value
                || type === Enums.marketingDiscountType.Quantity.value){
                    html+= `(${promoCode},${Format.percent(amount/1000)} )`;
                    return html;
                }
            html+= `( ${promoCode}, ${Format.currency(amount/1000)} )`;
            return html;
        },
        orderStatus(v,values){
            let enumStatus = Enums.orderStatus,
                text = Enums.getEnumText(v,'OrderStatus'),
                color = 'text-danger';
            if(v === enumStatus.Shipped.value || v === enumStatus.Refunded.value) 
                color = 'text-success';
            if(v === enumStatus.Refund.value) color = 'text-warning';
            if(v === enumStatus.ShippedFailure.value) return `<span class=${color}>${text}(${values.shipmentErrorCode})</span>`;
            if(v !== enumStatus.Shipped.value) return `<span class=${color}>${text}</span>`;
            return `<span class=${color}>${text}(${values.shipmentDuration}${I18N.get('Second')})</span>`;
        },
        clearingTime(v,values){
            let resourceName = 'Clearings',
                html = `
                    <div class="lh-20">${I18N.get('CreationTime', resourceName)}: ${Format.dateTime(values.creationTime)}</div>
                `;
            if(values.completionTime){
                html+=`
                    <div class="lh-20">${I18N.get('CompletionTime', resourceName)}: ${Format.dateTime(values.completionTime)}</div>
                `
            }
            if(values.canceledTime){
                html+=`
                    <div class="lh-20">${I18N.get('CanceledTime', resourceName)}: ${Format.dateTime(values.canceledTime)}(${values.cancelReason})</div>
                `
            }
            return html;
        },
        clearingOrderAmount(v, values){
            let html = Format.currency(v/100),
                pattern = values.clearingPattern,
                amount = values.clearingAmount/1000,
                amountText = Format.percent(amount);
            if(pattern === Enums.clearingRulePattern.Cash.value)
                amountText = Format.currency(amount);
            return html + `(${amountText})`
        },
        clearingPayeeAndReceiver(v, values){
            let resource = 'Clearings',
                customer = I18N.get('Customer', resource),
                payee = values.payeeId === 0 ? customer : values.payee,
                receiver = values.receiverId === 0 ? customer : values.receiver;
            return `
                <div class="lh-20">${I18N.get('Payee', resource)}: ${payee}</div>
                <div class="lh-20">${I18N.get('Receiver', resource)}: ${receiver}</div>
            `
        },
        clearingAmountReceivableAndReceived(v, values){
            let resource = 'Clearings',
                color = '',
                received = values.amountReceived,
                currentUserId = Config.getCurrentUser().id;
            if(values.receiverId == currentUserId) {
                color = 'text-success';
            }
            if(values.payeeId == currentUserId) {
                color = 'text-danger';
                received = -1 * received;
            }
            if(received === 0) color = "text-warning";
            return `
                <div class="lh-20">${I18N.get('Receivable', resource)}: ${Format.currency(values.amountReceivable/100)}</div>
                <div class="lh-20">${I18N.get('Received', resource)}: <span class="${color}">${Format.currency(received/100)}</div>
            `
        },
        clearingStatisticPayeeOrReceiver(v, values, isPayee){
            if( (isPayee && values.payeeId === 0)
                || (!isPayee && values.receiverId === 0)
                ) return I18N.get('Customer', 'Clearings');
            return v;
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
        advertisementPublishedTime(v, values){
            let publishedTime = values.publishedTime,
                pausedTime = values.pausedTime;
            if(!Ext.isEmpty(pausedTime)){
                return `<span class="text-danger">${I18N.get('Paused', 'Advertisements')}: ${Format.dateTime(pausedTime)}</span>`;
            }
            if(!Ext.isEmpty(publishedTime)){
                return `<span class="text-success">${I18N.get('Published', 'Advertisements')}: ${Format.dateTime(publishedTime)}</span>`;
            }
            return I18N.get('Unpublished','Advertisements');
        },
        customerServiceSettingPublishedTime(v, values){
            let publishedTime = values.publishedTime,
                pausedTime = values.pausedTime;
            if(!Ext.isEmpty(pausedTime)){
                return `<span class="text-danger">${I18N.get('Paused', 'CustomerServices')}: ${Format.dateTime(pausedTime)}</span>`;
            }
            if(!Ext.isEmpty(publishedTime)){
                return `<span class="text-success">${I18N.get('Published', 'CustomerServices')}: ${Format.dateTime(publishedTime)}</span>`;
            }
            return I18N.get('Unpublished','CustomerServices');
        }
    },

});