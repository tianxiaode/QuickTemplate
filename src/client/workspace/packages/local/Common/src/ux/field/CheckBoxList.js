Ext.define('Common.ux.field.CheckBoxList',{
    extend: 'Ext.field.Field',
    xtype: 'uxcheckboxlist',

    config:{
        totalCount: 0,
        startValue: 0
    },
    hasInitCheckBox: false,
    currentPage: 1,
    emptyValue: null,
    fullValue: '*',
    focusedCls: Ext.baseCSSPrefix + 'focused',
    itemText: null,
    itemCls: 'x-checkcell',

    getBodyTemplate(){
        return [
            {
                reference: 'navElement',
                cls: 'nav'
            },
            {
                reference: 'itemListElement',
                cls: 'item-list'
            }
        ]
    },

    initialize(){
        let me = this;
        me.callParent();
        me.itemQueryValue = '.'+ me.itemCls;
        me.bodyElement.addCls('checkbox-list');
        me.initCheckbox(me);
    },

    initCheckbox(me){
        let total = me.getTotalCount(),
            html = [];
        me.emptyValue = '0'.repeat(total);
        me.fullValue = '1'.repeat(total)
        html.push(Format.format(Template.checkBoxItem, me.fullValue , I18N.get('All'), 'lh-20'));
        me.navElement.setHtml(html.join(''));
        me.initList();
        me.el.on('tap', me.onColumnTap, me, { delegate: me.itemQueryValue} );
        me.hasInitCheckBox = true;
    },

    initList(){
        let me = this,
            itemText = me.itemText,
            total = me.getTotalCount(),
            startValue = me.getStartValue(),
            value = me.getValue() || '',
            html = [];
        for(let i=0; i<total;i++){
            let itemValue = i+ startValue,
                text = itemText && itemText[i] || itemValue;
            html.push(Format.format(Template.checkBoxItem, itemValue, text, 'item'));
        }
        me.itemListElement.setHtml(html.join(''));
        me.refreshList(value);
    },


    onColumnTap(e, target){
        let me = this,
            el = Ext.fly(target),
            checkCls = Format.checkCls;
        
        el.toggleCls(checkCls);
        
        let className = target.className,
            selected = className.includes(checkCls),
            index = target.getAttribute('data-value'),
            value = me.getValue() || me.emptyValue,
            startValue = me.getStartValue();
        if(index === me.fullValue){
            value = selected ? me.fullValue : me.emptyValue;
            me.setValue(value);
            return;
        }

        value = Format.replaceChar(value, parseInt(index) - startValue  , selected ? '1' : '0');
        me.setValue(value);
    },

    getValue: function() {
        return this._value;
    },

    updateValue(value, old){
        let me = this;
        me.callParent(arguments);
        me.refreshList(value);
    },

    getAllCheckbox(){
        return this.navElement.down(this.itemQueryValue);
    },

    refreshList(value){
        let me= this,
            isSelectAll = value === me.fullValue,
            allCheckbox = me.getAllCheckbox();
        if(Ext.isEmpty(value)) value = me.emptyValue;
        isSelectAll && me.setChecked(allCheckbox);
        !isSelectAll && me.setUnchecked(allCheckbox);
        let items = me.itemListElement.query(me.itemQueryValue),
            start = me.getStartValue();
        items.forEach(item=>{
            let column = parseInt(item.getAttribute('data-value')) -start,
                selected = value === me.fullValue || value[column] === '1';
            selected && me.setChecked(item);
            !selected && me.setUnchecked(item);
        })

    },

    setChecked(el){
        if(!el.dom) el = Ext.fly(el);
        el.addCls(Format.checkCls);
    },

    setUnchecked(el){
        if(!el.dom) el = Ext.fly(el);
        el.removeCls(Format.checkCls)
    },

    rawToValue: Ext.emptyFn
});
