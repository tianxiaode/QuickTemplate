Ext.define('Common.ux.files.FileItem',{
    extend: 'Ext.Component',
    xtype: 'uxfileitem',

    baseCls: 'file-item ',
    template: [
        {
            cls: 'icon-wrap',
            reference: 'iconWrapElement',
            children:[
                {
                    reference: 'iconElement',
                    cls: 'icon'
                }
            ]
        },
        {
            reference: 'descriptionElement',
            tag: 'p',
            cls: 'x-editable text-truncate'
        },
        {
            reference: 'selectElement',
            cls: 'x-checkcell x-row-select',
            children:[
                {
                    cls: 'x-checkbox-el x-font-icon'
                }
            ]
        }
    ],


    updateRecord(record) {
        if(!record) return;
        let me = this;
        me.setIcon(record);
        me.setImage(record);
        me.setTooltip(record);
        me.setDescription(record);
        me.setRecordInfo(record);
        return record;
    },

    setIcon(record){
        if(!record) return;
        let me = this,
            mime = record.get('mimeType'),
            desc = record.get('description');
        let iconCls = me.getIconCls(mime, desc);
        me.iconElement.dom.className = iconCls;
        me.selectElement.removeCls(Format.checkCls);
    },

    getIconCls(mime, desc){
        let types = Format.mimeType,
            iconCls = '';
        if(mime === types.apk) iconCls = `fi md-icon-android text-success`;
        if(mime === types.bin) iconCls = 'x-fa fa-microchip text-warning';
        if(mime === types.zip) iconCls = 'x-fa fa-file-archive text-success';
        if(mime === types.mp4) iconCls = 'x-fa fa-video text-info';
        if(desc.toLowerCase().startsWith('AstraPro'.toLowerCase())) iconCls = 'x-fa fa-tools text-info';
        iconCls += ' icon';
        return iconCls;
    },

    setImage(record){
        if(!record) return;
        let me = this,
            types = Format.mimeType,
            mime = record.get('mimeType');        
        if(mime !== types.jpg && mime !== types.png) {
            me.iconWrapElement.setStyle('background-image', 'none');
            return;
        }
        me.iconWrapElement.setStyle('background-image',`url("${URI.crud('file', record.get('hash'))}")`);
    },

    setTooltip(record){
        if(!record) return;
        let resource = 'Files',
            tips = [
                `${I18N.get('Size', resource)}: ${Format.fileSize(record.get('size'))}`,
                `${I18N.get('Hash', resource)}: ${record.get('hash')}`,
                `${I18N.get('CreationTime', resource)}: ${Format.dateTime(record.get('creationTime'))}`
            ];
        this.iconElement.set({title: tips.join('\n')});
    },

    setDescription(record){
        let me = this,
            description = record.get('description'),
            el = me.descriptionElement,
            query = record.store.getProxy().extraParams.query;
        el.set({title: description});
        if(!Ext.isEmpty(query)){
            description =description.replace(new RegExp('(' + query + ')', "gi"), '<span style="color:red;">$1</span>');
        }
        el.dom.innerHTML = description;
    },

    setRecordInfo(record){
        let me = this;
        me.selectElement.set({
            'data-id': record.getId(),
            'data-field': 'id'
        })
    }

})