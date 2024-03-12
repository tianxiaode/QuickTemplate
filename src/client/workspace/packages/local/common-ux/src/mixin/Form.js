Ext.define('Common.mixin.Form', {
    extend: 'Common.mixin.Component',

    config:{
        form: null,
        formDefaults: {
            flex: 1,
            mixinName: 'form'
        }
    },

    applyForm(config, old){
        return Ext.updateWidget(old, config,this, 'getComponentConfig', 'formDefaults');
    },

    updateForm(config){
        config && this.add(config);
    }

})
