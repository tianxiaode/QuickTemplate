Ext.define('Common.ux.crud.controller.mixin.ChildTap',{
    extend: 'Common.ux.crud.controller.mixin.Base',

    detailViewXtype: null,

    initList(){
        let me = this,
            list = me.list;
        list.childTap && list.on('childtap', me.onListChildTap, me);        
    },

    onListChildTap(sender, location, eOpts){
        let me = this,
            record = location.record;
        if(!record) return;
        let target = location.sourceElement;
        if(!target) return;
        let classList = target.classList.value;

        if(classList.includes('fa-edit')){
            me.doUpdate(record);
            return;
        }

        if(classList.includes('fa-ellipsis-h')){
            me.onShowDetail(record);
            return;
        }

        if(classList.includes('x-checkbox-el')){
            let field = target.getAttribute('data-field');
            if(field){
                let value = record.get(field),
                    old = Ext.isBoolean(value) ? value :  !Ext.isEmpty(value),
                    checked = !old;
                value = Ext.isBoolean(value) 
                    ? checked 
                    : Ext.isDate(value) 
                        ? new Date()
                        : null;
                record.set(field, value );
                me.doColumnCheckChange(record, field, checked);
                return;                
            }
        }

        me.doListChildTap && me.doListChildTap(me, record, target, classList);
    },

    onShowDetail(record){
        let me = this,
            viewXtype= me.detailViewXtype;
        if(Ext.isEmpty(viewXtype)) Ext.raise('No detail view type');
        
        let params = me.getViewParams({}, null ,record);
        ViewMgr.setParams(viewXtype, params);
        me.redirectTo(`${viewXtype}/detail`);
    },

})