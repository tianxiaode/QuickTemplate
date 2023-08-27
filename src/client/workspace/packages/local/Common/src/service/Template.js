Ext.define('Common.service.Template', {
    alternateClassName: 'Tpl',
    singleton: true,

    templates:{},
    

    flag: '<span class="x-fa fa-flag text-info"></span>',

    checkBoxItem: `
        <div class="x-checkcell {2} ">
            <span class="x-checkbox-el x-font-icon " data-value="{0}" data-field="{3}"></span><span>{1}<span>
        </div>
    `,
    
    spinnerEditor:
        `
            <div class="col-2 text-center "><span data-field="{0}" class="editor fs-6 x-fa fa-caret-left {2} "></span> </div>
            <div class="col-8  text-center">{1}</div>
            <div class="col-2 text-center "><span data-field="{0}" class="editor fs-6 x-fa fa-caret-right {2} "></span></div>
        `,

            
    messageList:
        `
            <ul class="message-tips">
            <tpl for=".">
                <li class="danger">{.}</li>
            </tpl>
            </ul>
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

    destroy() {
        let me = this;
        me.templates = null;
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
            last.localized = Ext.bind(Format.localized, scope);
            last.unDefine = Ext.bind(Format.unDefine, scope);    
            tpl.push(last);
            return Ext.XTemplate.get(tpl);

        }
    }

});