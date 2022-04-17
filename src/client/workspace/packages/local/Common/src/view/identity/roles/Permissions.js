Ext.define('Common.view.identity.roles.Permissions',{
    extend: 'Ext.field.Field',
    xtype: 'uxpermissionsfield',
    
    mixins:[
        'Common.mixin.ConfigReady',
    ],

    resourceName: 'Permissions',
    labelAlign: 'top',
    langLabel: 'Permissions',
    autoLabel: false,
    isReady: false,
    scrollable: 'y',

    valueSet: new Set(),

    accessValue: 'Permission:Access',
    checkBoxItem:  `<div class="x-checkcell" data-group='{0}' data-value="{1}">
            <span class="x-checkbox-el x-font-icon"></span><span class='lang-el' data-lang='{1}'>{1}</span>
    </div>`,


    onConfigReady(){
        let me = this,
            policies = Config.getAuthData().policies,
            rows = {},
            html = '';

        Ext.iterate(policies,p=>{
            if(p === 'AbpIdentity.UserLookup') return;
            let split = me.splitPermission(p),
                isPhone = me.isPhone(),
                group = split.group,
                permission = split.permission,
                flexCls = (isPhone && 'flex-column') || 'flex-row',
                firstWidth = (isPhone && '100%') || '140px',
                row = rows[group];
            if(!row) {
                row = rows[group] = 
                    [
                        `<div class='d-flex ${flexCls}'>` ,
                        `<div class=' text-truncate lang-el py-1' style='width:${firstWidth};' data-group='${group}' data-lang='${group}'>${group}</div>`,
                    ];
                let isSpecial = ['FeatureManagement','SettingManagement'].includes(split.first);
                isSpecial && row.push(me.getCheckBoxHtml(group, p));
                !isSpecial && row.push(me.getCheckBoxHtml(group, me.accessValue));

            }
            if(permission && permission !== 'ManagePermissions' ){
                row.push(me.getCheckBoxHtml(group, p));
            };
        });
        Ext.iterate(rows,(r,v)=>{
            html += v.join('') + '</div>';
        })

        me.bodyElement.setHtml(`<div class='container h-100'>${html}</div>`);
        me.onLocalized();
        me.bodyElement.on('tap', me.onPermissionCheck, me, { delegate :'.x-checkcell'} );
        me.permissionElements = me.bodyElement.query('div.x-checkcell');
        me.langElements = me.bodyElement.query('.lang-el');
        me.isReady = true;
        me.refreshPermission();
    },


    getCheckBoxHtml(group, value, flexCls){
        let cb = Format.format(this.checkBoxItem,group,value)
        return `<div class='px-2 py-1'>${cb}</div>`;
    },

    applyValue(value, oldValue){
        let me = this;
        if(Ext.isString(value)){
            value = value.split(',');
        }
        if(!Ext.isArray(value)) value = [];
        let valueSet = me.valueSet;
        valueSet.clear();
        value.forEach(v=>{            
            !Ext.isEmpty(v) && valueSet.add(v);
        });

        if (me.isConfiguring) {
            me.originalValue = value;
        }

        return value;
    },

    updateValue(value, oldValue){
        let me = this;

        me.refreshPermission();
        if (!(Ext.isEmpty(value) && Ext.isEmpty(oldValue))) {
            me.validate();
        }
        
        let newValue = Ext.isArray(value) ? String(value.sort()) : String(value),
            old = Ext.isArray(oldValue) ? String(oldValue.sort()) : String(value);


        if (newValue !== old && !me.isConfiguring) {

            me.fireEvent('change', me, value, oldValue);
        }

        me.setDirty(me.isDirty());

    },

    refreshPermission(){
        let me = this,
            cls = Format.checkCls,
            els = me.permissionElements,
            value = me.getValue();
        if(!me.isReady) return;
        els.forEach(dom=>{
            let group = dom.getAttribute('data-group'),
                name = dom.getAttribute('data-value');              
            if(name === me.accessValue) name = group;
            let includes = value && value.includes(name),
                el = Ext.fly(dom);
            includes && el.addCls(cls);
            !includes && el.removeCls(cls);
        })
    },

    onPermissionCheck(sender, target){
        let me = this,
            permission = target.getAttribute('data-value'),
            group = target.getAttribute('data-group')
            set = me.valueSet;
        if(!me.isReady) return;
        if(permission === me.accessValue) permission = group;
        let value = !set.has(permission);
        !value && set.delete(permission);
        permission === group && !value  && me.cancelManagerPermissions(set, group);
        value && set.add(permission);
        value && set.add(group);

        me.setValue(Array.from(set));

    },

    cancelManagerPermissions(set, group){
        set.forEach(s=>{
            s.includes(group) && set.delete(s);
        })
    },

    onLocalized(){
        let me = this, 
            resourceName = me._resourceName;
        me.callParent();
        if(!me.isReady) return;
        let  els = me.langElements;
        Ext.each(els, el=>{
            let lang = el.getAttribute('data-lang');
            el.innerHTML = I18N.get(lang, resourceName);
        });
    },


    splitPermission(permission){
        let names = permission && permission.split('.');
        return {
            first: names[0],
            group: `${names[0]}.${names[1]}`,
            permission: names[2]
        }
    },

    doDestroy(){
        let me = this;
        me.langElements = null;
        me.permissionElements = null;
        me.valueSet = null;
        me._value = null;
        me.callParent();
    }

})