Ext.define('Common.shared.ux.form.OneInputFormController',{
    extend: 'Common.shared.ux.form.BaseController',
    alias: 'controller.shared-oneinputformcontroller',


    onSave(){
        let me = this,
            view = me.getView(),
            record = view.getRecord(),
            fieldName = view.getFieldName();
        if(Ext.isEmpty(fieldName) || Ext.isEmpty(record)) return;
        let field = record.fieldsMap[fieldName],
            value = me.getFieldValue(field),
            url = view.getRemoteController();
        value = me.getSubmitValue(field, value);
        url = me.getSubmitUrl(field, url, fieldName, value, record);
        Http.patch(url, { value: value}).then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
    },    

    getFieldValue(field){
        let me = this;
            type = field.type,
            isString = type === 'string',
            isInt = type === 'int',
            isFloat = type === 'float',
            isDate = type === 'date',
            isDateTime = field.isDateTime || false;
        if(isInt || isFloat) return me.lookup('numberField').getValue();
        if(isString) return me.lookup('textField').getValue();
        if(isDateTime) {
            let input = me.lookup('dateTimePanel'),
                value = input.getValue();
            value.setHours(input.getHour());
            value.setMinutes(input.getMinute());
            value.setSeconds(input.getSecond());
            return Format.dateTime(value);
        };
        if(isDate) return Format.date2(me.lookup('datePanel').getValue());
    },

    getSubmitValue(field , value){
        if(Ext.isFunction(field.submitValue)) return field.submitValue.call(null, value);
        if(Ext.isString(field.submitValue) && Ext.isFunction(Format[field.submitValue])){
            return Format[field.submitValue].call(null, value);
        }
        return value;
    },

    getSubmitUrl(field, url, fieldName, value, record){
        if(!Ext.isArray(url)) return url;
        let args = [];
        url.forEach(m=>{
            let key = m;
            if(m.includes('#')){
                key = m.substr(1);
                if(key === 'field'){                        
                    key = fieldName;
                    let depend = field.depends && field.depends[0];
                    if(depend)key= depend;
                }else if(key === 'value'){
                    key = value;
                } else {
                    key = record.get(key);
                }
            }
            args.push(key);
        })
        return URI.crud.apply(null,args);
    },

    onSubmitSuccess(response){
        let me = this,
            view = me.getView(),
            record = view.getRecord(),
            fieldName = view.getFieldName(),
            data = response.request.jsonData,
            value = data.value;
        me.callParent(arguments);
        let field = record.fieldsMap[fieldName],
            depend = field.depends && field.depends[0];
        if(depend) record.set(depend, value);
        record.set(fieldName, value);
    },

    onHide(){
        let me = this,
            view = me.getView();
        view.hide();
   },


})