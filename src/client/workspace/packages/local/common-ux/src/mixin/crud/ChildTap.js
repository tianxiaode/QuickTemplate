Ext.define('Common.mixin.crud.ChildTap',{
    extend: 'Common.mixin.Base',

    config:{
        childTap: false
    },

    childTapListener: null,

    updateChildTap(value){
        let me = this,
            list = me.getList() || me;
        if(value){
            me.childTapListener = list.on({
                childtap: me.onListChildTap,
                scope: me,
                destroyable: true
            })
        }else{
            Ext.destroy(me.childTapListener);
        }
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
            me.doMultilingual(record);
            return;
        }

        if(classList.includes('x-checkbox-el')){
            me.onCheckBoxTap(target.getAttribute('data-field'), record);
            return;
        }

        if(classList.includes('translations')){
            me.onShowInfoMenu(`uxmultilingualmenu`, location.record, location.sourceElement);
            return;
        }

        me.doListChildTap && me.doListChildTap(me, record, target, classList, location);
    },

    doDestroy() {
        Ext.destroy(this.childTapListener);
    }

})