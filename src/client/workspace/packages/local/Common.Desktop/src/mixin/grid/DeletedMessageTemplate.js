Ext.define('Common.Desktop.mixin.grid.DeletedMessageTemplate', {
    mixinId: 'deletedmessagetemplatemixin',

     /**
      * 删除信息模版
      */
     deletedMessageTemplate:[
        '<div class="message-tips">',
        '<ul class="message-tips-list">',
        '<tpl for=".">', 
        '<li class="pointthree">{.}</li>',
        '</tpl>',
        '</div>'
    ],

    /**
     * 获取删除信息模版
     */
    getDeletedMessageTemplate(){
        var me = this,
            template = me.deletedMessageTemplate;
        if(Ext.isArray(template)){
            template = me.deletedMessageTemplate = new Ext.XTemplate(template);
        }
        return template;
    },
   
});