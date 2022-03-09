Ext.define('Common.phone.ux.form.Dialog',{
    extend: 'Ext.Panel',
    xtype: 'commonphone-dialog',

    requires:[
        'Ext.field.TextArea',
        'Common.shared.ux.panel.NumberInput',
        'Common.shared.ux.panel.DateTime'
    ],

    mixins:[
        'Common.shared.mixin.Messageable',
    ],

    classCls: Ext.baseCSSPrefix + 'dialog', 
    modal:true,
    floated: true,
    centered: true,
    border: true,
    width: '95%',
    height: 'auto',
    defaults:{
        autoLabel: false,
    },
    
    currentInput: null,
    defaultListenerScope: true,

    config:{
        url: null,
        text:{
            xtype: 'textfield'
        },
        number:{
            xtype: 'uxnumberinputpanel'
        },
        textarea:{
            autoLabel: false,
            xtype: 'textareafield'
        },
        date:{
            xtype: 'uxdatetimepanel'
        }
    },

    buttons:{
        message: true,
        fill: true,
        ok: {handler: 'onSave'},
        cancel: {handler: 'onCancel'}
    },

    header:{
        ui: 'dark',
        padding: '0 0 0 10px'
    },

    getPhoneDefaultButtons(){
        return {}
    },

    createText(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            hidden: true,
            autoLabel: false,
        }, newCmp);
    },

    applyText(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createText');
    },

    updateText(config){
        if(config) this.add(config);
    },

    createNumber(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            hidden: true,
        }, newCmp);
    },

    applyNumber(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createNumber');
    },

    updateNumber(config){
        if(config) this.add(config);
    },

    createTextarea(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            hidden: true,
        }, newCmp);
    },

    applyTextarea(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createTextarea');
    },

    updateTextarea(config){
        if(config) this.add(config);
    },

    createDate(newCmp){
        return Ext.apply({
            ownerCmp: this,
            hidden: true,
        }, newCmp);
    },

    applyDate(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createDate');
    },

    updateDate(config){
        if(!config) return;
        this.add({ xtype: 'container', layout: 'center', items:[config]});
    },

    setField(field, type, value){
        let me = this,
            f = me.down(`[fieldName=${field}]`) 
            || (type === 'text' && me.getText()) 
            || ((type === 'int' || type === 'float') && me.getNumber())
            || (type === 'textarea' && me.getTextarea())
            || (type === 'date' && me.getDate());
        me.getMessageButton().setHidden(true);
        if(me.currentInput) me.currentInput.setHidden(true);
        if(!f)  {
            me.hide();
            return;
        }
        f.setDecimals && f.setDecimals(type === 'int' ? 0 : 2);
        me.currentInput = f;
        me.field = field;
        me.value = value;
        me.setTitle(I18N.get(field, me.resourceName));
        f.setHidden(false);
        (f.isField || f.isNumberInput ) && f.setValue(value);
        if(f.isDataTimePanel){
            f.setValue(value);
            f.setTimeValue(value.getHours(), value.getMinutes(), value.getSeconds());
        }
        f.isList && me.initListSelected(f, value);
    },

    initListSelected(input, value){
        let valueField = input.valueField,
            store = input.getStore(),
            selectable = input.getSelectable();
        if(!store.isLoaded()){
            Ext.defer(this.initListSelected, 50, this, [input, value]);
            return;
        }
        selectable.deselectAll();
        if(!Ext.isArray(value)) value = [value];
        let isAppend = selectable.getMode() === 'multi';
        Ext.each(value,v=>{
            let r = store.findRecord(valueField, v);
            if(!r) return;
            selectable.select(r,isAppend);
        })
    },

    onSave(){
        let me = this,
            url = me.getUrl(),
            value = me.getInputValue(true);
        if(Ext.isEmpty(value)){
            Http.patch(url).then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
            return;
        }
        if(me.currentInput.xtype === 'textareafield'){
            Http.patch(url, {value: value}).then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
            return;
        }
        url = `${url}/${encodeURIComponent(value)}`;
        Http.patch(url).then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
    },


    getInputValue(isSubmitValue){
        let me = this,
            input = me.currentInput;
        if(!input) return null;
        if(input.isField && !input.isTreeSelect || input.isNumberInput) return input.getValue();
        if(input.isTreeSelect){
            let value = input.getValue();
            return isSubmitValue ? value : input.getSelection();
        }
        if(input.isDataTimePanel){
            let value =input.getValue();
            value = Ext.Date.add(value, Ext.Date.HOUR, input.getHour());
            value = Ext.Date.add(value, Ext.Date.MINUTE, input.getMinute());
            value = Ext.Date.add(value, Ext.Date.SECOND, input.getSecond());
            return isSubmitValue ? Format.dateTime(value) : value;
        }
        return me.getListValue(input);
    },


    getListValue(input){
        let selections = input.getSelections(),
            valueField = input.valueField,
            selectable = input.getSelectable(),
            mode = selectable.getMode(),
            values = [];
        Ext.each(selections,s=>{
            values.push(s.get(valueField));
        })
        if(mode === 'multi') return values;
        return values[0];
        
    },

    onSubmitSuccess(response){
        let me = this;
        me.showMessage(I18N.get('UpdateSuccess'), false);
        me.fireEvent('saved', me, me.field, me.getInputValue());
        Ext.defer(me.onCancel, 2000, me);
    },

    onSubmitFailure(response, eOpts) {
        let me = this,
            error = Failure.getError(response);
        me.unmask();
        me.showMessage(error, true);
    },

    onCancel(){
        this.hide();
    }

})