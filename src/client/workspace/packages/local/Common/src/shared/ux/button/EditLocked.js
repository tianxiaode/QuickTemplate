Ext.define('Common.shared.ux.button.EditLocked',{
    extend: 'Ext.Button',
    xtype: 'uxeditlockedbutton',

    iconCls: 'x-fa fa-lock',
    //langText: 'EditLocked',

    initialize(){
        let me = this;
        me.callParent(arguments);
        me.on('tap', me.onLockedChange, me);
    },

    onLockedChange(e) {
        let me = this,
            cls = me.getIconCls();
        if(cls.includes('unlock')){
            me.setIconCls('x-fa fa-lock');
            //Ext.platformTags.desktop && me.setText(I18N.get('EditLocked'));
            me.fireEvent('lockedchange', me, true);
    
        }else{
            me.setIconCls('x-fa fa-unlock');
            //Ext.platformTags.desktop && me.setText(I18N.get('Edit'));
            me.fireEvent('lockedchange', me, false);
        }

    },

})