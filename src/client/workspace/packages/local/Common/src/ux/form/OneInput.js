Ext.define('Common.ux.form.OneInput',{
    extend: 'Common.ux.form.Base',
    xtype: 'uxoneinputform',

    mixins:[
        'Common.mixin.component.TextField',
        'Common.mixin.component.Textarea',
        'Common.mixin.component.Number',
        'Common.mixin.component.UxNumber',
        'Common.mixin.component.Date',
        'Common.mixin.component.DateTime',
        'Common.mixin.component.field.Email',
    ],

    emailField:{
        name: null,
        inputType: 'email',
        hidden: true
    },

    hasBack: false,
    hasCancel:false,
    useTextInFormButton: false,
    hasEmailField: false,

    ui: 'dark',
    controller: null,
    classCls: Ext.baseCSSPrefix + 'dialog', 
    modal:true,
    floated: true,
    centered: true,
    border: true,
    width: '95%',
    height: 'auto',
    closable:true,
    closeAction: 'onCancel',
    hideMode: 'display',

    defaults:{
        autoLabel: false,
    },
    
    currentInput: null,
    defaultListenerScope: true,
    buttonToolbar: {
        hidden: true
    },

    config:{
        url: null,
    },


    setField(config){
        let me = this,
            field = config.field,
            value = config.value,
            f = me.down(`[inputType=${config.type}]`),
            title = config.title || field;
        me.hideMessageButton();
        if(me.currentInput) me.currentInput.setHidden(true);
        if(!f)  {
            me.hide();
            return;
        }
        config.decimals && f.setDecimals(config.decimals);
        me.currentInput = f;
        me.field = field;
        me.value = value;
        me.setTitle(I18N.get(title, me.resourceName));
        f.setHidden(false);
        f.setValue && f.setValue(value);
        f.isDataTimePanel && f.setTimeValue(value.getHours(), value.getMinutes(), value.getSeconds());
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
        Http.patch(url, {value: value}).then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
    },


    getInputValue(isSubmitValue){
        let me = this,
            input = me.currentInput;
        if(!input) return null;
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
        if(input.isList ) return me.getListValue(input);
        return input.getValue();
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
            error = Http.getError(response);
        me.unmask();
        me.showMessage(error, true);
    },

    onCancel(){
        this.hide();
    }

})