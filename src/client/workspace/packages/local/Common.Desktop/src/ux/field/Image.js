/**
 * 图片选择字段
 */
Ext.define('Common.Desktop.ux.field.Image', {
    extend: 'Ext.field.Picker',
    xtype: 'imagefield',

    requires: [
        'Common.Desktop.ux.field.trigger.Image'
    ],

    config:{
    },

    triggers: {
        expand: {
            type: 'image',
            //userCls: 'imagetrigger'
        }
    },

    floatedPicker: {
        xtype: 'panel',
        floated: true,
        height:200
    },
 
    applyPicker: function(picker, oldPicker) {
        var me = this;

        picker = me.callParent([picker, oldPicker]);

        if (picker) {
            me.pickerType = picker.xtype === 'datepicker' ? 'edge' : 'floated';
            picker.ownerCmp = me;
        }

        return picker;
    },

    createFloatedPicker: function() {
        return this.getFloatedPicker();
    },

    createEdgePicker: function() {
        var me = this;
        return Ext.merge({}, me.getEdgePicker());
    },

});