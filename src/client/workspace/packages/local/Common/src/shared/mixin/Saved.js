Ext.define('Common.mixin.Saved', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            initialize: 'initialize',
        }
    },

    createButtons: false,
    saveAndHie : true,
    saveSuccess: false,

    initialize(){
        let me = this;
        if(me.createButtons){
            if(Ext.platformTags.phone){

            }else{
                me.setButtons({
                    error: true,
                    success: true,
                    fill:true,
                    save: { handler: me.onSave, scope: me},
                    cancel:{ weight: 100, handler: me.onHide, scope: me},  
                })
            }
        }
        me.errorButton = me.down('uxerrorbutton');
        me.successButton = me.down('uxsuccessbutton');
    },

    onSaveSuccess(response){
        let me = this;
        me.successButton.setHidden(false);
        me.errorButton.setHidden(true);
        let tooltip = me.successButton.getTooltip();
        tooltip.setHtml(me.saveAndHie ? I18N.get('SavedAndExit') : I18N.get('UpdateSuccess'));
        tooltip.show();
        me.saveSuccess = true;
        if(me.saveAndHie) Ext.defer( Ext.platformTags.phone && me.back || me.onHide, 1000, me);
    },

    onFailure(response){
        this.setError(Failure.getError(response));
    },

    setError(error){
        let me = this;
        me.successButton.setHidden(true);
        me.errorButton.setHidden(false);
        let tooltip = me.errorButton.getTooltip();
        tooltip.setHtml(error);
        tooltip.show();
        me.saveSuccess = false;
    },

    initInfoButton(){
        let me = this;
        me.successButton.setHidden(true);
        me.errorButton.setHidden(true);
        me.saveSuccess = false;
    }

});