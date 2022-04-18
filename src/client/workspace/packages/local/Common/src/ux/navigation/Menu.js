Ext.define('Common.ux.navigation.Menu',{
    extend: 'Ext.Container',
    xtype: 'uxnavigationmenu',

    layout: 'vbox',
    width: 220,
    config:{
        langTitle: null,
        data: null,
        headerIconCls: 'x-fa fa-hdd text-primary',
        header:{
            xtype: 'component',
            userCls: 'border-bottom',
            style: 'font-size:16px;background-color:var(--background-color)',
            padding: '20 15',
        },
        list:{
            xtype: 'dataview',
            flex: 1,            
            userCls: 'navigation-menu',
            itemTpl: `
                <div class="row " style="padding: 15px 10px;">
                    <div class="col-auto"><span class="{iconCls} pr-4 text-primary" style="padding-left:5px;font-size:16px;"></span></div>
                    <div class="col text-truncate"><span>{text}</span></div>
                    <div class="col-auto pr-3"><span class="x-fa fa-circle point"></span></div>
                </div>
                `
                ,
            store:{                
                fields:[
                    'iconCls', 'langText', 'viewType', 'resourceName', 'permission', 'text'
                ]
            }
        },
    },

    updateLangTitle(){
        this.onLocalized();
    },

    createComponent(newCmp) {
        return Ext.apply({
            ownerCmp: this
        }, newCmp);
    },

    applyHeader(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },


    updateHeader(config){
        if(!config) return;
        this.add(config);
        this.refreshTitle();
    },

    applyList(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    updateList(config){
        if(!config) return;
        let me = this,
            list = me.getList(),
            data = me.getData();
        if(!data) return;
        list = me.add(list);
        list.on('select', me.onListSelected, me);
        let store = list.getStore();
        data.forEach(r=>{
            if (r.permission && !ACL.isGranted(r.permission)) return;
            record = Object.assign({}, r);
            record.text = I18N.get(record.langText,record.resourceName);
            store.add(record);
        });
        let first = store.getAt(0);
        list.select(first);

    },

    onListSelected(sender, selected, eOpts){
        let me = this;
        me.fireEvent('select' ,me, selected, eOpts);
    },

    onLocalized(){
        let me = this;
        me.callParent();
        me.refreshTitle();
        me.refreshItemText();
    },

    refreshTitle(){
        let me = this,
            header = me.getHeader();
        header.setHtml(`<span class="${me.getHeaderIconCls()} pr-4" style=""></span><span>${I18N.get(me.getLangTitle(), me.getResourceName())}</span>`);
    },

    refreshItemText(){
        let me = this,
            store = me.getList().getStore(),
            items = store.getData().items;
        items.forEach(r=>{
            r.set('text', I18N.get(r.get('langText'), r.get('resourceName')));
        })
    },

})