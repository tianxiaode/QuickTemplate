Ext.define('Common.ux.crud.controller.mixin.ChildTap',{
    extend: 'Common.ux.crud.controller.mixin.Base',

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
            me.onShowView('more', record);
            return;
        }

        if(classList.includes('fa-globe')){
            me.onShowView('multilingual', record);
            return;
        }

        if(classList.includes('x-checkbox-el')){
            me.onCheckBoxTap(target.getAttribute('data-field'), record);
            return;
        }

        if(classList.includes('translations')){
            me.onShowInfoMenu(`${me.entityName}multilingualmenu`, location.record, location.sourceElement);
            return;
        }

        me.doListChildTap && me.doListChildTap(me, record, target, classList);
    },



})