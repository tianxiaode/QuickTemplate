Ext.define('Common.shared.ux.Spinner',{
    extend: 'Ext.Container',
    xtype: 'uxspinner',

    layout: 'vbox',

    config:{
        min: 0,
        max: Number.MAX_VALUE,
        up:{
            xtype: 'button',
            iconCls: 'x-fa fa-caret-up'
        },
        down:{
            xtype: 'button',
            iconCls: 'x-fa fa-caret-down'
        },
        valueComponent:{
            xtype: 'component',
            userCls: 'text-center text-primary lh-32'
        }
    },

    createComponent(newCmp) {
        return Ext.apply({
            ownerCmp: this
        }, newCmp);
    },

    applyUp(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyDown(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyValueComponent(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    initialize(){
        let me = this;
        me.callParent();
        let up = me.getUp(),
            down = me.getDown();
        me.add([
            up, me.getValueComponent(), down
        ])
        up.on('tap', me.onPlus, me);
        down.on('tap', me.onMinus, me);
    },
  
    setValue(value){
        if(!Ext.isNumber(value)) value = 0;
        this.getValueComponent().setHtml(value);
    },

    onPlus(){
        this.changeValue(1);
    },

    onMinus(){
        this.changeValue(-1);
    },

    changeValue(dir){
        let me = this,
            cmp = me.getValueComponent(),
            old = parseInt(cmp.getHtml()),
            value = (old || 0) + dir;
        me.getDown().setDisabled(value <= me.getMin());
        me.getUp().setDisabled(value >= me.getMax());
        cmp.setHtml(value);
        me.fireEvent('change', me, value, old);
    }
})