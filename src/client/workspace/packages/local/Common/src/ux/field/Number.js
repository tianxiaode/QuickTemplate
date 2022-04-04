Ext.define('Common.ux.field.Number',{
    extend: 'Ext.field.Field',
    xtype: 'uxnumberfield',
    

    config:{
        minValue: null,
        maxValue: null,

        value: 100.1,
        decimals: 2,
    },

    classCls: Ext.baseCSSPrefix + 'number-input',

    getBodyTemplate() {
        let me = this,
            subTpl = [],
            subHtml = '',
            tpl = [];
        for(let i = 0; i<10; i++){
            subTpl.push(`<div class="number-item border m-1 text-center lh-30" data-value="{0}-${i}">${i}</div>`);
        }
        subHtml = subTpl.join('');
        for(let i = 9; i>=0; i--){
            tpl.push(`<div class="flex-grow-1">`);
            tpl.push(Format.format(subHtml, i));
            tpl.push(`</div>`);
        }
    
        return [
            {
                reference: 'titleElement',
                cls: 'container text-center fw-bolder fs-5 p-2'
            },
            {
                reference: 'itemElement',
                cls: 'd-flex flex-wrap w-100',
                html: tpl.join(''),
                listeners:{
                    tap:{
                        delegate: '.number-item',
                        fn: me.onElementTap,
                        scope: me
                    }
                }
            }
        ];
    },


    updateValue(value){
        this.initValueDisplay(value);
        return value;
    },

    onElementTap(e, source, eOpts){
        let me = this,
            input = source.getAttribute('data-value'),
            decimals = me.getDecimals(),
            pos = input.substr(0,1),
            num = input.substr(2,1),
            value = me.getValue()
            text = me.getFormatText(value);
        text = text.replace('.', '');
        text = '0'.repeat(10 - text.length) + text;
        text = Format.replaceChar(text, parseInt(10-pos-1), num);
        if(decimals>0) text = text.substr(0, 10 -decimals) + '.' + text.substr(10-decimals);
        value = decimals === 0  && parseInt(text) || parseFloat(text);
        me.setValue(value);
    },

    doValidate: function(value, errors, skipLazy) {
        var me = this,
            String = Ext.String,
            minValue = me.getMinValue(),
            maxValue = me.getMaxValue();

        me.callParent([ value, errors, skipLazy ]);

        if (minValue != null && value < minValue) {
            errors.push(String.format(me.minValueText, minValue));
        }
        else if (maxValue != null && value > maxValue) {
            errors.push(String.format(me.maxValueText, maxValue));
        }
    },

    onLocalized(){
        let me = this;
        me.decimalsText = I18N.get('DecimalsText');
        me.minValueText = I18N.get('MinValueText');
        me.maxValueText = I18N.get('MaxValueText');
        me.callParent();
    },


    privates:{
        initValueDisplay(value){
                let me = this,
                    text = me.getFormatText(value);
            me.titleElement.setHtml(text);
            me.initElementDisplay(text);
        },

        getFormatText(value){
            let me = this,
                decimals = me.getDecimals(),
                format = `${'0'.repeat(10)}${decimals>0 ? '.' : ''}${'0'.repeat(decimals)}`,
                text = Format.number(value, format);
            return text;
        },

        initElementDisplay(value){
            let me = this,
                els = me.getItemEls();
            value = value.replace('.', '');
            value = ('0'.repeat(10 - value.length) + value);
            els.forEach(el=>{
                let dataValue = el.getAttribute('data-value'),
                pos = dataValue.substr(0,1),
                    num = dataValue.substr(2,1),
                    className = el.className;
                if(value.substr(9 - pos,1) === num) {
                    !className.includes('selected') && (el.className = className + ' selected');
                    return;
                }
                el.className = className.replace(' selected', '');
            })
        },

        getItemEls(){
            let me = this,
                els = me.itemEls;
            if(els) return els;
            els = me.itemEls = me.itemElement.query('.number-item');
            return els;
        },

        getDataFormat(){
            let me = this,
                decimals = me.getDecimals();
            if(decimals === 0) return '0';
            if(decimals === 1) return '0.0';
            return '0.00';
        }
    }
})