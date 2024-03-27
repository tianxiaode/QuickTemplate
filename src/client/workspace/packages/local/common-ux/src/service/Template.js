Ext.define('Common.service.Template', {
    alternateClassName: 'Template',
    singleton: true,

    config:{
        flagTpl: '<span class="x-fa fa-flag text-info"></span>',
        checkBoxItemTpl: `
            <div class="x-checkcell {cls} ">
                <span class="x-checkbox-el x-font-icon " data-value="{value}" data-field="{field}"></span><span>{label}<span>
            </div>
        `,
        messageTpl: `
            <p class="m-1 text-bold" >{title}</p>
            <ul class="message-tips">
                <tpl for="messages">
                    <li class="{parent.type} my-1 mx-2">
                        {.}
                    </li>
                </tpl>
            </ul>
        `,
        spinnerEditor: `
            <div class="col-2 text-center "><span data-field="{leftField}" class="editor fs-6 x-fa fa-caret-left {leftCls} "></span> </div>
            <div class="col-8  text-center">{value}</div>
            <div class="col-2 text-center "><span data-field="{rightField}" class="editor fs-6 x-fa fa-caret-right {rightCls} "></span></div>
        `
    },

    constructor(config){
        this.initConfig(config);
    },

    applyCheckBoxItemTpl(tpl){
        return Ext.XTemplate.get(tpl);
    },

    applyMessageTpl(tpl){
        return Ext.XTemplate.get(tpl);
    },

    applySpinnerEditor(tpl){
        return Ext.XTemplate.get(tpl);
    },

    // templates:{},

    // fn:['highlight'],

    getCheckBoxItem(title, value, field, label, cls){
        return this.getCheckBoxItemTpl().apply({
            title: title,
            value: value,
            field: field,
            label: label,
            cls: cls
        });
    },

    getMessage(title, messages, type){
        return this.getMessageTpl().apply({
            title: title,
            messages: messages, 
            type: type
        });
    },  
            
    getTplWithScope(config, scope){
        if(config.isXTemplate) return;
        let me = Template;
        config = (Ext.isString(config) && me[config]) || config;
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
        this.destroyMembers('flagTpl', 'checkBoxItemTpl', 'messageTpl', 'spinnerEditor')
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