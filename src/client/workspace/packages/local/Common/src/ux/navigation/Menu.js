Ext.define('Common.ux.navigation.Menu',{
    extend: 'Ext.Container',
    xtype: 'uxnavigationmenu',

    layout: 'vbox',
    width: 220,
    userCls: 'bg-white ',
    margin: '0 20px 0 0',
    config:{
        headerIconCls: 'x-fa fa-hdd',
        header:{
            xtype: 'component',
            userCls: 'border-bottom',
            style: 'font-size:16px;',
            padding: '20 15',
            // html:`
            //     <span class="x-fa fa-database pr-4" style=""></span><span>fdsdfsdf</span>
            // `
        },
        navigationList:{
            xtype: 'list',
            flex: 1,
            userCls: 'bg-white',
            itemCls: ' listing',
            itemTpl: `
                <div class="bg-white row " style="padding: 15px 10px;">
                    <div class="col-auto"><span class="{iconCls} pr-4" style="padding-left:5px;font-size:16px;"></span></div>
                    <div class="col overflow-hidden"><span>{text}</span></div>
                    <div class="col-auto pr-3"><span class="x-fa fa-circle point"></span></div>
                </div>
                `
                ,
            store:{                
                fields:[
                    'iconCls', 'text', 'viewType', 'resourceName', 'permission'
                ]
            }
        },
        data: null,
        title: null,

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

    applyNavigationList(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },


    initialize(){
        let me = this;
        me.callParent();
        me.initHeader();
        me.initList();
    },

    initHeader(){
        let me = this,
            header = me.getHeader(),
            title = I18N.get(me.getTitle());
        header = me.add(header);
        header.setHtml(`<span class="${me.getHeaderIconCls()} pr-4" style=""></span><span>${title}</span>`);
    },

    initList(){
        let me = this,
            list = me.getNavigationList(),
            data = me.getData();
        if(!data) return;
        list = me.add(list);
        list.on('select', me.onListSelected, me);
        let store = list.getStore();
        data.forEach(r=>{
            if (r.permission && !ACL.isGranted(r.permission)) return;
            record = Object.assign({}, r);
            record.text = I18N.get(record.text,record.resourceName);
            store.add(record);
        });
        let first = store.getAt(0);
        list.getSelectable().select(first);
    },

    onListSelected(sender, selected, eOpts){
        let me = this;
        me.fireEvent('select' ,me, selected, eOpts);
    },

    getSelection(){
        return this.getNavigationList().getSelectable().getSelections()[0];
    }


})