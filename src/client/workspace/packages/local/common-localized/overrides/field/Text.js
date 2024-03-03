Ext.define('Common.overrides.field.Text',{
    override: 'Ext.field.Text',

    config:{
        langBadFormatMessage: null,
        langPlaceholder: null
    },
    // responsiveConfig:{
    //     'desktop && !cancel':{
    //         labelAlign: 'left'
    //     },
    // },


    onLocalized(){
        let me = this,
            badFormatMessage = me.getLangBadFormatMessage(),
            text = me.getLangPlaceholder();

        text = me.getLocalizedText(text);
    
        text && me.setPlaceholder(text);

        if(!badFormatMessage){
            me.setLangBadFormatMessage(me.badFormatMessage);
        }
        me.badFormatMessage = I18N.get(me.getLangBadFormatMessage());
        me.callParent();
    }

    // initialize(){
    //     let me = this;
    //     me.callParent(arguments);
    //     me.initUi();
    // },

    // initUi(){
    //     let me = this,
    //         parent = me.up();
    //     if(Ext.platformTags.phone && (parent && parent.isToolbar)){
    //         me.setUi('solo');
    //     }
    // }


})