Ext.define('Common.ux.dataview.Format',{
    extend: 'Common.util.Format',
    singleton: true,

    fn:{
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
    }
})