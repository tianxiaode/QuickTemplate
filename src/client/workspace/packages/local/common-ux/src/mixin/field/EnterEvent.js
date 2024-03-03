Ext.define('Common.mixin.field.EnterEvent', {
    extend: 'Common.mixin.Component',

    allEnterFields: null,

    config:{
        autoTabIndex: true
    },

    initialize() {
        if(Ext.platformTags.desktop) this.initEnterEvent();
    },

    
    initEnterEvent(){
        let me = this,
            autoTabIndex = me.getAutoTabIndex(),
            index = 0;
        if(!autoTabIndex) return;
        let fields = me.allEnterFields = me.query('field[focusable]:not([hidden]):not(containerfield):not([disabled]):not([readOnly])');
        Ext.each(fields, f=>{
            f.setTabIndex(index+1);
            f.setKeyMapEnabled(true);
            f.setKeyMap({
                enter: {
                    handler: me.doEnterNextField,
                    scope: me
                } 
            });
            index++;
        })
        me.initFocus();
    },

    /**
     * 回车后，焦点移动到下一个字段
     * @param {事件} event 
     * @param {字段} field 
     */
    doEnterNextField(event, field) {
        event.preventDefault();
        let me =  this,
            fields = me.allEnterFields,
            index = field.getTabIndex(),
            next = fields.find(f=>{
                return f.getTabIndex()>index && !field.getHidden() && !field.getReadOnly();
            });
        if(next)  {
            next.focus();
            return false;
        }
        me.onSave && me.onSave();
        return false;
    },

    /**
     * 初始化焦点
     */
    initFocus(){
        let field = this.down('field[tabIndex=1]');
        field && field.focus();    
    },


    doDestroy(){
        this.destroyMembers( 'allEnterFields');
    }


})
