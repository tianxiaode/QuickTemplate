Ext.define('Common.shared.ux.menu.Input', {
    extend: 'Common.shared.ux.menu.Menu',
    xtype: 'shared-uxinputmenu',

    layout: 'fit',
    requires:[
        'Ext.layout.Fit',
    ],

    mixins:[
        'Common.shared.mixin.Messageable',
    ],

    defaultListenerScope: true,

    config:{
        valueField: null,
        url: null,
        resourceName: null,
        buttons:{
            message: true,
            fill: true,
            ok: {
                handler: 'onSave',
            },
            cancel: {
                handler: 'onCancel',
                weight: 100
            }
        },
        input: {}
    },

    applyInput(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createInput');
    },

    updateInput(config){
        if(config){
            this.add(config);
            this.initDisplay();
        }
    },

    updateValueField(field){
        let me = this,
            button = me.getMessageButton();
        me.initDisplay();
        if(button) button.setHidden(true);
        return field;
    },

    updateRecord(record){
        this.initDisplay();
    },

    initDisplay(){
        let me = this,
            input = me.getInput(),
            fieldName = me.getValueField(),
            record = me.getRecord();
        if(Ext.isEmpty(fieldName) || Ext.isEmpty(record) || Ext.isEmpty(input)) return;
        let field = record.fieldsMap[fieldName],
            store = record.store,
            messageField = store.messageField,
            resourceName = me.resourceName,
            value =record.get(fieldName),
            type = field.type; 
        me.setTitle(I18N.get(fieldName, resourceName) + ' - ' + record.get(messageField));
        me.initInputValue(input, value , type);
    },

    initInputValue:Ext.emptyFn,


    onSave(){
        let me = this,
            record = me.getRecord(),
            fieldName = me.getValueField(),
            input = me.getInput();
        if(Ext.isEmpty(fieldName) || Ext.isEmpty(record) || Ext.isEmpty(input)) return;
        let value = input.getValue(),
            field = record.fieldsMap[fieldName],
            url = me.getUrl();
        value = me.getSubmitValue(field, value);
        if(Ext.isDate(value)) value = Format.dateTime(value);
        url = me.getSubmitUrl(field, url, fieldName, value, record);
        Http.patch(url, { value: value}).then(me.onSubmitSuccess, me.onSubmitFailure, null, me);

    },

    onCancel(){
        this.hide();
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
            record = me.getRecord(),
            fieldName = me.getValueField(),
            data = response.request.jsonData,
            value = data.value;
        let field = record.fieldsMap[fieldName],
            depend = field.depends && field.depends[0];
        if(depend) {
            record.set(depend, value);
        }else{
            record.set(fieldName, value);
        }
        record.commit();
        me.showMessage(I18N.get('UpdateSuccess'), false);
        Ext.defer(me.hide, 2000, me);
    },

    onSubmitFailure(response, eOpts) {
        let me = this,
            error = Failure.getError(response);
        me.unmask();
        me.showMessage(error, true);
    },

})