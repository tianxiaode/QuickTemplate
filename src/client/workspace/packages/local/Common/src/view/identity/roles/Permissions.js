Ext.define('Common.view.identity.roles.Permissions',{
    extend: 'Ext.field.Field',
    xtype: 'uxpermissionsfield',
    
    resourceName: 'Permissions',
    labelAlign: 'top',
    langLabel: 'Permissions',
    autoLabel: false,


    checkBoxItem:  `<div class="x-checkcell" data-value="{0}">
            <span class="x-checkbox-el x-font-icon " ></span><span data-lang={2}>{1}</span>
    </div>`,


    getBodyTemplate(){
        let me = this,
            policies = ACL.getPolicies(),
            resourceName = me.resourceName,
            rows = {}, 
            html = '';
        Ext.iterate(policies,p=>{
            let permission = me.getPermission(p),
                key =permission.group + '.' + permission.default,
                row = rows[key];
            if(!row) {
                row = rows[key] = [
                    `<div class='py-1 row group' data-group='${key}'>` ,
                    `<div class='col-auto text-truncate checkbox-label' style='width:140px;' data-lang='${key}'>${I18N.get(key, resourceName)}</div>`,
                ];
                let isSpecial = ['FeatureManagement','SettingManagement'].includes(permission.group);
                isSpecial && row.push(me.getCheckBoxHtml(key, I18N.get(p, resourceName), p));
                !isSpecial && row.push(me.getCheckBoxHtml(key, I18N.get('Permission:Access'), 'Permission:Access'));

            }
            if(!Ext.isEmpty(permission.permission) && permission.permission !== 'ManagePermissions' ){
                row.push(me.getCheckBoxHtml(p, I18N.get(p, resourceName), p));
            };
        });
        Ext.iterate(rows,(r,v)=>{
            html += v.join('') + '</div>';
        })
        return [{
            reference: 'inputWrapElement',
            cls: 'container',
            html: html
        }, {
            reference: 'underlineElement',
            cls: Ext.baseCSSPrefix + 'underline-el'
        }];
    },

    getCheckBoxHtml(value,label, lang){
        let cb = Format.format(this.checkBoxItem,value,label,lang)
        return `<div class='col-auto px-2'>${cb}</div>`;
    },

    updateValue(value, oldValue){
        let me = this;

        if (!(Ext.isEmpty(value) && Ext.isEmpty(oldValue))) {
            me.validate();
        }
        console.log(value, oldValue);
        let diff = Ext.Array.difference(value || [], oldValue || []);
        console.log('diff', diff);
 
        if (diff.length >0) {
            me.initPermissions(value);
            me._value = value;

            if (!me.isConfiguring) {
                me.fireEvent('change', me, value, oldValue);
            }
        }
 
        me.setDirty(me.isDirty());
    },

    initPermissions(value){
        let me = this,
            checkCls = Format.checkCls,
            el = me.inputWrapElement,
            selections = el.query(`div.x-checkcell.${checkCls}`);
        Ext.each(selections,s=>{
            s.className = s.className.replace(checkCls, '');
        })
        Ext.each(value,p=>{
            let cb = el.down(`div.x-checkcell[data-value='${p}']`),
                checkCls = Format.checkCls;
            if(!cb) return;
            let dom = cb.dom;
            dom.className = `${dom.className} ${checkCls}`;
        })

    },

    initialize(){
        let me = this;
        me.callParent()
        me.inputWrapElement.on('tap', me.PermissionCheck, me, { delegate :'.x-checkcell'})
    },

    PermissionCheck(sender, target){
        let me = this,
            checkCls = Format.checkCls,
            className = target.className,
            isCheck = !className.includes(checkCls),
            value = target.getAttribute('data-value'),
            permission = me.getPermission(value),
            oldValue = me.getValue() || [],
            newValue = [];
        if(isCheck){
            oldValue.push(value);
            newValue = Ext.Array.clone(oldValue);
        }else{
            newValue = Ext.Array.remove(oldValue, value);
        }
        //target.className = isCheck ? className.replace(checkCls, '') : `${className} ${checkCls}`;
        //if(Ext.isEmpty(permission.permission)) return;

        // isCheck = !isCheck;
        // newValue = isCheck ? oldValue.remove
        // let accessCb = me.inputWrapElement.down(`div.x-checkcell[data-value='${permission.group}.${permission.default}']`);
        // console.log(accessCb)
        // if(accessCb) {
        //     className = accessCb.className;
        //     accessCb.className = isCheck ? className.replace(checkCls, '') : `${className} ${checkCls}`;
        // }
        console.log('newValue',newValue);
        me.setValue(newValue);
    },

    onLocalized(){
        let me = this, 
            resourceName = me.resourceName,
            el = me.inputWrapElement,
            cbs = el.query('.x-checkcell'),
            cbLabels = el.query('.checkbox-label');
        Ext.each(cbs, cb=>{
            let last = cb.lastElementChild,
                lang = last.getAttribute('data-lang');                
            last.innerHTML = I18N.get(lang, resourceName);
        });
        Ext.each(cbLabels,l=>{
            let lang = l.getAttribute('data-lang');
            l.innerHTML = I18N.get(lang, resourceName);
        })
    },

    getPermission(permission){
        let names = permission && permission.split('.');
        return {
            group: names[0],
            default: names[1],
            permission: names[2]
        }
    }

})