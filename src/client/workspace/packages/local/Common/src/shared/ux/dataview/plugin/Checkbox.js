Ext.define('Common.shared.ux.dataview.plugin.Checkbox',{
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.uxdataviewcheckbox',

    init(list) {
        var me = this;
        me.list = list;
        me._listListeners = list.el.on('tap', me.onCheckboxClick, me , { delegate: '.x-checkcell'});
    },

    onCheckboxClick(e, target){
        let me = this,
            checkCls = Format.checkCls,
            store = me.list.getStore(),
            el = Ext.fly(target),
            id = el.getAttribute('data-id'),
            field = el.getAttribute('data-field')
            record = store.getById(id);
        if(!record) return;

        el.toggleCls(checkCls);
        let className = target.className,
            selected = className.includes(checkCls);
        if(className.includes('x-row-select')){
            me.onSelectItem(me.list, record, selected);
            return;
        }
        me.updateCheckField(me.list, record, field, selected);
    },

    onSelectItem(list, record , selected){   
        let selectable = list.getSelectable();
        selected && selectable.select(record, true);
        !selected && selectable.deselect(record);
    },

    updateCheckField(list, record ,field,selected){
        let controller = list.getController() || list.up().getController();
        record.set(field, selected);
        controller.doColumnCheckChange(record, field, selected);
    },

    destroy(){
        let me = this;
        me.list = null;
        Ext.destroy(me._listListeners);
        me.callParent();
    },

 })