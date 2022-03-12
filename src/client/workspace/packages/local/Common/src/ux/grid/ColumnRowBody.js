Ext.define('Common.ux.grid.ColumnRowBody',{
    extend: 'Ext.grid.RowBody',
    xtype: 'uxcolumnrowbody',

    config:{
        masked: null
    },

    isColumnsLoaded: false,
    userCls: 'checkbox-list',
    currentRuleId: null,
    allColumnId: 99999999,
    entityName: null,
    minHeight: 50,


    applyMasked(masked) {
        var isVisible = true,
            currentMask;
 
        if (masked === false) {
            masked = true;
            isVisible = false;
        }
        else if (Ext.isString(masked)) {
            masked = {
                xtype: 'loadmask',
                message: masked
            };
        }
        else if (masked && !masked.isComponent && masked.hidden) {
            isVisible = false;
        }
 
        // Subscript notation is used to reference Ext.Mask to prevent creation of an
        // auto-dependency
        // eslint-disable-next-line dot-notation
        currentMask = Ext.factory(masked, Ext['Mask'], this.getMasked());
 
        if (currentMask) {
            currentMask.sender = this;
            currentMask.setHidden(!isVisible);
 
            // TODO: Reliable render pathway and rendered transition.
            // was: this.el.append(currentMask.el);
            currentMask.render(this.el);
        }
 
        return currentMask;
    },
 
    /**
     * Convenience method which calls {@link #setMasked} with a value of `true` (to show the mask).
     * For additional functionality, call the {@link #setMasked} function direction (See the
     * {@link #masked} configuration documentation for more information).
     */
    mask(mask) {
        this.setMasked(mask || true);
    },

    unmask() {
        this.setMasked(false);
    },

    initialize(){
        let me = this;
        me.callParent(arguments);
        me.on('hiddenchange', me.onHiddenChange,me);
    },
    
    onHiddenChange(sender, newValue, oldValue){
        if(newValue) return;
        let me = this;
        let rule = me.getRule(),
            ruleId = rule && rule.getId(),
            record = me.getRecord();
        if(me.currentRuleId == ruleId) return;
        me.el.setHtml('');
        me.currentRuleId = ruleId;
        me.isEditable = rule.get('editable');
        me.isPayee = rule.get('isPayee');
        me.isDefault = rule.get('isDefault');
        me.ruleId = ruleId;
        if(Ext.isEmpty(ruleId) || !record) return;
        let deviceSn = record.get('deviceSn');
        if(me.isDefault){
            me.el.setHtml(I18N.get('NotNeedSetDeviceOrColumn', 'ClearingRules'));
            return;
        }
       me.mask(I18N.get('Loading'));
        Http.get(URI.crud(me.entityName,ruleId,'devices',  deviceSn, 'columns'))
            .then(me.onLoadColumnsSuccess, me.onLoadColumnsFailure, null, me);

    },

    onLoadColumnsSuccess(response){
        let me = this,
            result = Http.parseResponseText(response),
            data = result.result,
            html= [];
        me.unmask();
        me.columns = data;
        me.currentStorage = 0;
        let all = data[me.allColumnId.toString()][0];
        html.push(`<div class="nav">`);
        for(let i=0;i<10;i++){
            let text = I18N.get('MainStorage', 'DeviceInfos'),
                display = !me.isPayee && data.hasOwnProperty(i.toString()) ? '' : 'x-hidden x-hidden-display',
                selected = i === 0 ? 'selected' : '';
            if(i === 1) text = I18N.get('SubStorage', 'DeviceInfos') + '1';
            if(i>1) text = i;
            html.push(`<div class="nav-item ${display} ${selected}" data-value="${i}">${text}</div>`)
        }
        html.push(`<div class="flex-grow-1"></div>`);
        html.push(Format.format(Template.checkBoxItem,all.id, I18N.get('All'), all.isCheck ?  Format.checkCls: Format.uncheckCls, 'item'));
        html.push(`</div>`);
        html.push(`<div class="item-list"></div>`);
        me.el.setHtml(html.join(''));
        if(!me.isPayee) me.switchStorage();
        if(me.isEditable) {
            me.el.addCls('editable');
            me.el.on('tap', me.onColumnTap, me, { delegate: '.checkbox>span,.nav-item'} );
        }

    },


    switchStorage(){
        let me = this,
            el  = me.el.down('.item-list', true),
            storage = me.columns[me.currentStorage.toString()],
            html = [];
        storage.forEach(c=>{
            let id = c.id,
                checkCls = c.isCheck ? Format.checkCls: Format.uncheckCls,
                text = c.id.toString().substr(1);
            html.push(Format.format(Template.checkBoxItem, id, text, checkCls, 'item'));
        })
        el.innerHTML = html.join('');
    },

    getRule(){
        return this.row.getGrid().up().getRecord();
    },

    onLoadColumnsFailure(response){
        this.unmask();
        Failure.ajaxWithAlert(response);

    },

    onColumnTap(e, source){
        let me = this,
            isNav = source.className.includes('nav-item');
        if(isNav){
            let value = source.getAttribute('data-value');
            if(value == me.currentStorage) return;
            me.currentStorage = value;
            let parent = source.parentNode,
                selected = parent.querySelector('.selected');
            if(selected)selected.className = selected.className.replace(' selected', '');
            source.className += ' selected';
            me.switchStorage();
            return;
        }
        me.AddDeviceOrColumn(me, source);
    },

    AddDeviceOrColumn(me ,source){
        let record = me.getRecord(),
            entityName = me.entityName,
            column = parseInt(source.getAttribute('data-column')),
            check = !source.className.includes(Format.uncheckCls),
            action = check ? Http.delete : Http.patch,
            data =  { column: column, check: !check };
        if(column === me.allColumnId){
            action.call(Http, URI.crud(entityName, me.ruleId, 'devices', record.get('deviceSn')),data)
                .then(me.onSubmitSuccess,Ext.bind(Failure.ajax,me,[null, true],true),null, me);
            return;
        }
        action.call(Http, URI.crud(entityName, me.ruleId,'devices', record.get('deviceSn'), 'columns', column),data)
        .then(me.onSubmitSuccess,Ext.bind(Failure.ajax,me,[null, true],true),null, me);
},

    onSubmitSuccess(response){
        let me = this,
            data = response.request.jsonData;
        Toast(I18N.get('UpdateSuccess'));
        let query = `span[data-column='${data.column}']`
            el = me.el.down(query, true);
        if(!el) return;
        el.className = data.check ? Format.checkCls : Format.uncheckCls;
        //如果是取消选择，不需要执行后续操作
        if(!data.check) return;
        //选择了货道，将设备设置为未选择
        if(data.column < me.allColumnId){
            query = `span[data-column='${me.allColumnId}']`
            el = me.el.down(query, true);
            if(el) el.className = Format.uncheckCls;
            return;
        }
        //选择了设备，将全部货道设置为false
        let items = me.el.query(`span`);
        items.forEach(item=>{
            let column = item.getAttribute('data-column');
            if(column < me.allColumnId) item.className = Format.uncheckCls;            
        })

    }
    
})