Ext.define('Common.ux.crud.form.Tree',{
    extend: 'Common.ux.crud.form.Form',

    requires:[
        'Ext.field.Display'
    ],

    hasSaveAndNew: true,
    hasReset: true,
    minWidth: 600,

    config:{
        parentId:{
            xtype: 'hiddenfield',
            name: 'parentId'
        },
        parentName:{
            xtype: 'displayfield', 
            name: 'parentName'            
        },
        displayName:{
            xtype: 'textfield',
            name: 'displayName',
            maxLength: 128,
            required: true
        }
    },

    createComponent(newCmp) {
        return Ext.apply({
            ownerCmp: this
        }, newCmp);
    },

    applyParentId(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    updateParentId(config){
        if(config) this.add(config);
    },

    applyParentName(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    updateParentName(config){
        if(config) this.insert(0,config);
    },

    applyDisplayName(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    updateDisplayName(config){
        if(config) this.insert(1,config);
    }


})