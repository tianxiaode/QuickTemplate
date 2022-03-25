Ext.define('Common.view.identity.roles.EditController', {
    extend: 'Common.ux.crud.form.FormController',
    alias: 'controller.roleeditcontroller',
 
    init() {
        let me = this;
        me.initGrid();
        me.callParent();
    },

    defaultColumn:{
        autoText: false,
        menuDisabled: true,
        groupable: false
    },

    defaultValueColumn:{
        align: 'center',
        cell: { encodeHtml: false },
        renderer: Format.tristateCheckBox,
        sortable: false,
    },

    /**
     * 初始化网格
     */
    ready: false,
    initGrid(){
        let me = this,
            view = me.getView(),
            model = Common.data.model.identity.Permission,
            fields = model.fields,
            columns = [],
            settingFields = [];
        fields.forEach(f=>{
            let name = f.name;
            if(name === 'id') return;
            if(name === 'name'){
                columns.push(Object.assign({}, me.defaultColumn, { dataIndex: name, langText: 'Permissions'}));
                return;
            }
            if(name !== 'access') settingFields.push(name);
            columns.push(Object.assign({}, me.defaultColumn, me.defaultValueColumn,
                { 
                    dataIndex: name, 
                    langText: `Permission:${Format.capitalize(name)}`
                }
            ));
        });
        let grid = view.add({
            xtype: 'grid',
            resourceName: 'AbpIdentity',
            height: 400,
            grouped: false,
            columns: columns,
            store:{
                type: 'permissions'
            },           
        })
        me.settingFields = settingFields;
        me.grid = grid;
        me.store = grid.getStore();
        grid.on('childtap', me.onChildTap, me);
        me.initPermissionsData(me.store);
        me.ready = true;
    },

    /**
     * 初始化权限列表
     */
    initPermissionsData(store){
        let allPermissions = ACL.getPolicies();
        for (let permission  in allPermissions) {
            if(permission === 'AbpIdentity.UserLookup'
                || permission === 'FeatureManagement.ManageHostFeatures') continue;
            let names = permission.split('.'),
                id = `${names[0]}.${names[1]}`,
                record = store.getById(id);
            //console.log(id, permission)
            if(!record){
                record = store.add({ id: id, name: I18N.get(id, 'Permissions')})
            }
            if(names[2]){
                let field = names[2].toLowerCase();
                record.set(field, false);
            }
        }
    },

    /**
     * 恢复权限初始值
     */
    initPermissionsValues(){
        let me = this,
            fields = me.settingFields,
            store = me.store;
        store.each(r=>{
            r.set('access', false);
            fields.forEach(f=>{
                if(r.get(f) !== null) r.set(f, false);
            })
        })
    },

    setPermissionsValue(permissions){
        let me = this;
        if(!me.ready) Ext.defer(me.setPermissionsValue, 50, me, [permissions]);
        let store = me.store;
        permissions.forEach(p=>{
            let names = p.split('.'),
                id = `${names[0]}.${names[1]}`,
                record = store.getById(id);
            if(!record) return;
            record.set('access', true);
            if(names[2]) {
                record.set(names[2].toLowerCase(), true);
            };
            record.commit();
        })
    },


    /**
     * 表单提交前，获取权限值
     * @param {表单} form 
     * @param {提交值} values 
     */
    beforeFormSave(form, values){
        let me = this,
            store = me.store,
            fields = me.settingFields,
            permissions = [];
        store.each(r=>{
            let access = r.get('access');
            if(!access) return;
            let id = r.getId();
            permissions.push(id);
            let hasManagePermissions = false;
            fields.forEach(f=>{
                if(r.get(f)) {
                    if(f === 'create' || f === 'update' || f === 'delete') hasManagePermissions = true;
                    permissions.push(`${id}.${Format.capitalize(f)}`);
                }
            });
            if(hasManagePermissions) permissions.push(`${id}.ManagePermissions`);
        })
        values.permissions = permissions;
        return true;
    },

    /**
     * 重置时，恢复权限初始状态
     * 如果当前是编辑状态，恢复编辑前的权限
     */
    onReset(){
        let me = this;
        me.callParent();
        me.initPermissionsValues();
        let record = me.getView().getRecord();
        me.lookup('roleNameField').setReadOnly(record.get('isStatic'));
        if(!me.isNew) me.setPermissionsValue(me.getView().getRecord().get('permissions'));
    },

    /**
     * 权限单击事件
     * @param {事件触发者} sender 
     * @param {定位对象} location 
     * @param {事件参数} eOpts 
     */
    onChildTap(sender, location, eOpts){
        let me = this,
            cell = location.cell,
            dataIndex = cell.dataIndex,
            value = cell.getValue();
        if(dataIndex === 'name' || value === null ) return;
        let record = location.record;
        record.set(dataIndex, !value);
        record.commit();
        if(dataIndex === 'access'){
            if(!value) return;
            me.settingFields.forEach(f=>{
                if(f === 'access') return;
                if(record.get(f)) record.set(f, false);
            })
        }else{
            if(value) return;
            record.set('access', true);
        }
        record.commit();
    }
});