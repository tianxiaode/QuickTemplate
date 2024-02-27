Ext.define('Common.mixin.component.Form', {
    extend: 'Common.mixin.Component',

    config:{
        form: null,
    },

    createForm(config){
        return Ext.apply({
            flex: 1,
            ownerCmp: this
        }, config);
    },

    applyForm(config, old){
        return Ext.updateWidget(old, config,this, 'createForm');
    },

    updateForm(config){
        config && this.add(form);
    },

    doDestroy(){
        this.destroyMembers('form');
    }

})
