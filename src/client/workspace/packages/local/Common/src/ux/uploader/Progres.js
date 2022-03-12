Ext.define('Common.ux.uploader.Progress',{
    extend: 'Ext.Container',
    xtype: 'uxprogresspanel',

    requires:[
        'Ext.Progress'
    ],

    border: false,
    shadow: false,
    style: 'background-color:var(--background-color);',
    closeable: true,
    layout: {
        type: 'box',
        align: 'center'
    },
    defaults: {
        margin: '0 5px 0 0'
    },
    height: 32,

    config:{
        closeButton:{
            xtype: 'button',
            iconCls: 'x-fa fa-times'
        }
    },

    createCloseButton(newCmp) {
        let me = this;
        return Ext.apply({
            ownerCmp: me,
            listeners:{
                tap: me.onHide,
                scope: me
            }
        }, newCmp);
    },

    applyCloseButton(newCmp, old) {
        if(!this.closeable) return null;
        return Ext.updateWidget(old, newCmp,
            this, 'createCloseButton');
    },

    updateCloseButton(config){
        let me = this;
        if(me.closeable && config) me.add(config);
    },

    onHide(){
        this.setHidden(true);
    },

    updateProgress(filename, text, value ){
        let me = this,
            progress = me.down(`progress[filename=${filename}]`);
        if(!progress){
            let items = me.items.items,
                ln = items.length;
            Ext.each(items, item=>{
                if(item.getHidden()){
                    progress = item;
                    progress.filename = filename;
                    return false;
                }
            });
            if(!progress){
                ln--;
                if(ln <0) ln = 0;
                progress= me.insert(ln,{
                    xtype: 'progress',                     
                    height: 24,
                    filename: filename, 
                    flex: 1});
            }
        }
        progress.setHidden(false);
        progress.setText(text);
        if(!value) value = 0;
        progress.setValue(value);
        me.setHidden(false);
    },

    clearProgress(){
        let me = this,
            items = me.items.items;
        Ext.each(items, item=>{
            if(item.xtype !== 'progress') return;
            item.setHidden(true);
        })
    },


})