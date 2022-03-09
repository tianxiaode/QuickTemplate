Ext.define('Common.shared.ux.dataview.ListToolbar',{
    extend: 'Ext.Toolbar',
    xtype: 'uxlisttoolbar',

    config:{
        selectAll:{
            iconCls: 'md-icon-check-box-outline-blank',
            handler: 'onSelectAll'
        },
        delete:{
            iconCls: 'md-icon-delete',
            handler: 'onDelete',
            disabled: true
        },
        copyInfo:{
            xtype: 'component',
        },
        fill:{
            xtype: 'component',
            flex:1
        },
        close:{
            iconCls: 'md-icon-close',
        }
    },

    hasDelete: true,
    hasUpdate: true,
    hasCopyInfo: false,


    createButton(newCmp) {
        return Ext.apply({
            xtype: 'button',
            margin: '0 16px 0 0',
            arrow: false,
            ownerCmp: this
        }, newCmp);
    },

    applySelectAll(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createButton');
    },

    applyDelete(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createButton');
    },

    createClose(newCmp) {
        let me = this;
        return Ext.apply({
            xtype: 'button',
            margin: '0 0 0 16px',
            arrow: false,
            handler: me.onClose,
            scope: me,
            ownerCmp: me
        }, newCmp);
    },

    applyClose(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createClose');
    },

    createComponent(newCmp){
        return Ext.apply({
            ownerCmp: this
        }, newCmp);
    },

    applyFill(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyCopyInfo(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    initialize(){
        let me = this;
        me.callParent();

        if(me.hasUpdate){
            me.insert(0, me.getSelectAll());
        }

        if(me.hasDelete){
            me.insert(1, me.getDelete());
        }

        if(me.hasCopyInfo){
            me.insert(0, me.getCopyInfo());
        }

        me.add(me.getFill());

        me.add(me.getClose());

    },

    onClose(){
        this.setHidden(true);
    }
    
})

  