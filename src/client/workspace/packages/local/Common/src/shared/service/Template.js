Ext.define('Common.shared.service.Template', {
    alternateClassName: 'Template',
    singleton: true,

    templates:{},
    

    flag: '<span class="x-fa fa-flag text-info"></span>',
    selectItem: 
        `
        <div class="row py-2">
            <div class="col-12 px-1 py-2 text-truncate">{text:this.listHighlight(values,'text')}</div>
        </div>
        `,

    checkBoxItem: `
        <div class="x-checkcell {2} " data-value="{0}">
            <div class="x-checkbox-el x-font-icon " ></div>{1}
        </div>
    `,
    
    selectItemForDisplayName: 
        `
        <div class="row py-2">
            <div class="col-12 px-1 py-2 text-truncate">{displayName:this.listHighlight(values,'displayName')}</div>
        </div>
        `,

    spinnerEditor:
        `
            <div class="col-2 text-center "><span data-field="{0}" class="editor fs-6 x-fa fa-caret-left {2} "></span> </div>
            <div class="col-8  text-center">{1}</div>
            <div class="col-2 text-center "><span data-field="{0}" class="editor fs-6 x-fa fa-caret-right {2} "></span></div>
        `,

    row:
        `
            <div class="row  px-2 py-3 border-bottom">                
                <div class="col-{2} pl-0 h6 m-0 text-dark" >{0}</div>
                <div class="col-{3} pr-0 pl-0 h6 m-0 black-54 text-right item-value {4}" >{1}</div>
            </div>
        `,

    infoItem:
        `
            <div class="row py-2">
                <div class="col-4 pl-0 pr-1 fw-bolder">{0}</div>
                <div class="col-8 pl-0 pr-0 text-truncate  text-right">{1}</div>
            </div>
        `,
        
    messageList:
        `
            <ul class="message-tips">
            <tpl for=".">
                <li class="danger">{.}</li>
            </tpl>
            </ul>
        `,


    shareProduct:
        `
            <div class="row lh-24">
                <div class="col-6 pl-0 pr-1 text-truncate fw-bolder">{name:this.listHighlight(values,'name')}</div>
                <div class="col-6 pl-0 pr-0 text-truncate text-right">{category:getTranslationObjectText}</div>
            </div>
            <div class="row lh-24">
                <div class="col-6 pl-0 pr-1 text-truncate">{barcode:this.unDefine(values,'barcode')}</div>
                <div class="col-6 pl-0 pr-0 text-truncate text-right">{ageLimit}</div>
            </div>
            <div class="row lh-24">
                <div class="col-4 pr-1 text-truncate">{brand:this.unDefine(values, 'brand')}</div>
                <div class="col-4 pr-1 text-truncate text-center">{specification:this.unDefine(values, 'specification')}</div>
                <div class="col-4 text-truncate text-right">{unit:this.unDefine(values, 'unit')}</div>
            </div>
        `,
    
    product:
    `
        <div class="row lh-24">
            <div class="col-6 pr-1 text-truncate fw-bolder productDetail">{name:this.listHighlight(values,'name')}</div>
            <div class="col-6 text-truncate text-right">{organizationUnitName}</div>
        </div>
        <div class="row lh-24">
            <div class="col-6 pr-1 text-truncate">{category:getTranslationObjectText}</div>
            <div class="col-6 text-truncate text-right">{barcode:this.unDefine(values,'barcode')}</div>
        </div>
        <div class="row lh-24">
            <div class="col-4 pr-1 text-truncate">{unit:this.unDefine(values, 'unit')}</div>
            <div class="col-4 pr-1 text-truncate text-center">{brand:this.unDefine(values, 'brand')}</div>
            <div class="col-4 text-truncate text-right">{specifications:this.unDefine(values, 'specifications')}</div>
        </div>
        <div class="row lh-24">
            <div class="col-4 pr-1 text-truncate">{ageLimit}岁</div>
            <div class="col-4 pr-1 text-truncate text-center">{memberPrice:currency}</div>
            <div class="col-4 text-truncate text-right">{salesPrice:currency}</div>
        </div>
    `,

    treeSearchItem: `
        <div class="row py-2">
            <div class="col-5 px-1 text-truncate">{parentName}</div>
            <div class="col-7 pl-0 pr-1 text-truncate">{displayName:this.listHighlight(values,'displayName')}</div>
        </div>
    `,

    getTplWithScope(config, scope){
        if(config.isXTemplate) return;
        let me = Template;
        config = Ext.isString(config) && me[config] || config;
        if(!config) return;
        return me.create(config, scope);
    },
    
    getTpl(config){
        let me = Template,
            key = Ext.isObject(config) ? JSON.stringify(config) : config.toString(),
            template = me.templates[key];
        if(template && template.isXTemplate) return template;

        //创建模板
        if(me[key]) config = me[key];
        template = me.templates[key] = Ext.XTemplate.get(config);
        return template;
    },

    privates:{
        create(config, scope){
            let tpl = null,
                last = null;
            if(Ext.isEmpty(config)) return;
            if(Ext.isString(config)){
                last = {};
                tpl = [config];
            }else if(Ext.isArray(config)){
                let ln = config.length;
                    last = config[ln -1];
                if(Ext.isString(last)){
                    last = {}
                    tpl = config;
                }else if(Ext.isObject(last)){
                    tpl = config.slice(0, ln-1);
                }
            }
            last.listHighlight = Ext.bind(Format.listHighlight, scope );
            last.listCheckbox =  Ext.bind(Format.listCheckbox, scope);
            last.image = Ext.bind(Format.image, scope );
            last.localized = Ext.bind(Format.localized, scope);
            last.unDefine = Ext.bind(Format.unDefine, scope);    
            tpl.push(last);
            return Ext.XTemplate.get(tpl);

        }
    }

});