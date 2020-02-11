/**
 * 详细信息弹出菜单
 */
Ext.define('Common.Desktop.ux.menu.Details', {
    extend: 'Ext.menu.Menu',

    requires:[
    ],

    minWidth: 300,
    minHeight: 400,
    maxHeight: 600,
    maxWidth: 600,
    scrollable: true,
    anchor: true,
    padding: 10,  
    title: ''  ,
    headerCls: Ext.baseCSSPrefix + 'dialogheader',
    titleCls: Ext.baseCSSPrefix + 'dialogtitle',
    config:{
        url: null,
        infoTpl: null,
        infoId: null,
        titleTpl: null        
    },

    layout:{
        type: 'vbox',
        align: 'stretch'
    },
    userSelectable: {
        element: 'text',
        bodyElement: 'text'
    },

    items: [
        {
            xtype: 'component',
            itemId: 'infoComponent',
            userCls: 'listing',            
            flex: 1,
        }
    ],

    applyInfoTpl(tpl){
        tpl = Ext.create('Ext.XTemplate', Ext.clone(tpl));
        return tpl;
    },

    applyTitleTpl(tpl){
        tpl = Ext.create('Ext.XTemplate', Ext.clone(tpl));
        return tpl;
    },

    applyInfoId(id){
        let me = this,
            currentId = me.currentId,
            infoComponent = me.down('#infoComponent'),
            url = me.getUrl();            
        if(Ext.isEmpty(id)) {
            infoComponent.setHtml('<p style="text-align:center">'+ I18N.EmptyText+'<p>');
            me.setTitle('');
            return;
        }
        if(currentId === id) return; 
        Ext.Ajax.request({
            method: 'GET',
            url: url,
            params:{ id: id},
            success: me.onGetDataSuccess,
            failure: me.onGetDataFailure,
            scope: me
        });
        return id;
    },

    onGetDataSuccess(response, opts){
        let me = this,
            obj = Ext.decode(response.responseText),
            infoComponent = me.down('#infoComponent'),
            tpl = me.getInfoTpl(); 
        me.setTitle(me.getTitleTpl().apply(obj.result));
        infoComponent.setHtml(tpl.apply(obj.result));
    },

    onGetDataFailure(response, opts){
        let me = this,
            infoComponent = me.down('#infoComponent');
        me.setTitle('');
        infoComponent.setHtml(I18N.GetDataFailure);
        FAILED.ajax(response,opts, me);
    }

});
