Ext.define('Common.view.tree.BaseEdit', {
    extend: 'Common.ux.form.Crud',

    config:{
        idField:{
            xtype: 'hiddenfield',
            name: 'id'
        },
        parentIdField:{
            xtype: 'hiddenfield',
            name: 'parentId'
        },
        concurrencyStampField:{
            xtype: 'hiddenfield',
            name: 'concurrencyStamp'
        },
        parentNameField:{
            xtype: 'displayfield', 
            name: 'parentName'            
        },
        nameInputField:{
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

    applyIdField(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyParentIdField(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyParentNameField(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyConcurrencyStampField(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },


    applyNameInputField(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    initialize(){
        let me = this;        
        me.insert(0,[
            me.getIdField(),
            me.getParentIdField(),
            me.getConcurrencyStampField(),
            me.getParentNameField(),
            me.getNameInputField()
        ]);
        me.callParent();
    }

});