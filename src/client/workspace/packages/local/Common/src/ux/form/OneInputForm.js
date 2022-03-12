Ext.define('Common.ux.form.OneInputForm',{
    extend: 'Common.ux.form.Base',
    xtype: 'uxoneinputform',

    requires:[
        'Ext.layout.Center',
        'Common.ux.panel.NumberInput',
        'Common.ux.panel.Date',
        'Common.ux.panel.DateTime',
        'Common.ux.form.OneInputFormController',
    ],

    width: 500,
    height: 600,
    controller: 'shared-oneinputformcontroller',

    config:{
        fieldName: null,
        autoTabIndex: false,
    },

    defaults:{
        autoLabel: false,      
    },

    items:[
        {
            xtype: 'textfield',
            reference: 'textField',
            hidden: true,
        },
        {
            xtype: 'numberfield',
            reference: 'numberField',
            hidden: true,
        },
        {
            xtype: 'uxnumberinputpanel',
            reference: 'numberInput',
            hidden: true,
            flex: 1
        },        
        {
            xtype: 'container',
            layout: 'center',
            hidden: true,
            flex:1,
            items:[
                {
                    xtype: 'uxdatepanel',
                    reference: 'datePanel',
                    flex: 1
                },
            ]

        },
        {
            xtype: 'container',
            layout: 'center',
            hidden: true,
            flex:1,
            items:[
                {
                    xtype: 'uxdatetimepanel',
                    reference: 'dateTimePanel',
                }        
            ]
        }
    ],

    updateFieldName(name){
        this.initField();
        return name;
    },

    updateRecord(record){
        this.callParent(arguments);
        this.initField();        
        return record;
    },


    initField(){
        let me = this,
            fieldName = me.getFieldName(),
            record = me.getRecord();
        if(Ext.isEmpty(fieldName) || Ext.isEmpty(record)) return;
        let field = record.fieldsMap[fieldName];
        if(!field) return;
        let value =record.get(fieldName),
            type = field.type,
            isString = type === 'string',
            isInt = type === 'int',
            isFloat = type === 'float',
            isDate = type === 'date',
            isDateTime = field.isDateTime || false;
        let store = record.store,
            messageField = store.messageField,
            resourceName = me.resourceName;            
        me.setTitle(I18N.get(fieldName, resourceName) + ' - ' + record.get(messageField));
        let numberField = me.lookup('numberField'),
            textField = me.lookup('textField'),
            datePanel = me.lookup('datePanel'),
            dateTimePanel = me.lookup('dateTimePanel'),
            numberInput = me.lookup('numberInput');
        numberField.setHidden(!isInt && !isFloat);
        numberField.setDecimals(isInt ? 0 : 2);
        numberField.on('change', me.onNumberFieldChange, me);

        numberInput.setHidden(!isInt && !isFloat);
        numberInput.on('change', me.onNumberInputChange,me);

        textField.setHidden(!isString);
        datePanel.up().setHidden(!isDate || isDateTime);
        dateTimePanel.up().setHidden(!isDateTime);
        if(isInt || isFloat) numberField.setValue(value);
        if(isString) textField.setValue(value);
        if(isDateTime) {
            dateTimePanel.setTimeValue(value.getHours(), value.getMinutes(), value.getSeconds());
            dateTimePanel.setValue(value);
            dateTimePanel.setMinWidth(360);
            return;
        }
        if(isDate) {
            datePanel.setValue(value);
        }
    },

    onNumberInputChange(sender, newValue, old){
        if(newValue === old) return;
        let me = this,
            field = me.lookup('numberField'),
            decimals = field.getDecimals(),
            value =field.getValue(),
            input = decimals === 2? parseFloat(newValue) : parseInt(newValue);
        if(value === input) return;
        field.setValue(input);
    },

    onNumberFieldChange(sender, newValue, old){
        this.lookup('numberInput').setValue(newValue && newValue.toString() || '');
    }

})