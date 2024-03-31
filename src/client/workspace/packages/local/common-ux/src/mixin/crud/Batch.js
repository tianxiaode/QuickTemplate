Ext.define('Common.mixin.crud.Batch', {
    extend: 'Common.mixin.Base',

    config: {

    },

    batchDataKey: {
        messageField: 'MessageField',
        valueField: 'ValueField',
        url: 'Url',
        httpMethod:'HttpMethod',
        dialogTitle: 'DialogTitle',
        messageTitle: 'MessageTitle',
        messageType: 'MessageType',
        messageWarning: 'MessageWarning'
    },



    /**
     * 获取多实体远程操作数据
     * @param {要获取数据的记录} records
     * @param {信息字段} messageField 
     * @param {值字段} valueField 
     */
    getBatchData(records, action) {
        let me = this,
            messageField = me.getMessageField(),
            valueField = me.getValueField(),
            result = { values: [], messages: [] };
        //组织数据
        Ext.each(records, (r) => {
            let value = r.get(messageField),
                message = r.get(valueField);
            result.values.push(value);
            result.messages.push(message);
        });

        Ext.Object.each(me.confirmMessageKey, (key, value) => {
            result[key] = me[`_${action}${value}`];
        });

        result['url']

        return result;
    },

    /**
     * 执行多个实体的远程操作
     * @param {确认窗口标题} confirmTitle 
     * @param {确认信心} confirmMessage 
     * @param {要执行的操作} action 
     * @param {信息内容} contents 
     */
    doBatch(config) {
        if (records.length === 0) {
            return alert.error(I18N.get('NoSelection'));
        }

        let me = this,
            data = me.getBatchData(records, action);

        //确认后执行操作
        MsgBox.confirm(
            data.title,
            Template.getMessage(data.confirmTitle, data.messages.join(''), data.type, data.warning),
            function (btn) {
                if (btn !== "yes") return;
                action.apply(me, [data])
                    .then(
                        successFn || me.doBatchSuccess,
                        failureFn || me.onAjaxFailure,
                        null, me);
            },
            me
        );

    },

    /**
     * 获取信息模板
     */
    getMessageTpl() {
        var me = this,
            template = me.messageTemplate;
        if (template) return template;
        template = me.messageTemplate = Template.getTpl('messageList');
        return template;
    },

    /**
     * 执行多实体远程操作成功的回调函数
     * @param {响应} response 
     * @param {远程调用参数}} opts 
     */
    doBatchSuccess(response) {
        let me = this,
            store = me.getStore(),
            messageField = store.messageField,
            isDelete = response.request.method === 'DELETE',
            resultMsg = isDelete ? I18N.get("DeleteSuccess") : I18N.get('UpdateSuccess'),
            obj = Http.parseResponse(response),
            msg = ['<ul class="message-tips">'],
            items = obj && obj.items;
        Ext.Viewport.unmask();
        if (!items) {
            me.onRefreshStore();
            Toast(resultMsg, null, null, 3000);
            return;
        }
        items.forEach(m => {
            let text = Ext.isObject(m) ? m[messageField] || m.name || m.displayName : m;
            msg.push(`<li class="success">${text}:  ${resultMsg}</li>`);
        })
        msg.push('</ul>');

        if (isDelete && store.isTreeStore) {
            let selection = me.getSelections()[0];
            if (selection) {
                me.getSelectable().select(selection.parentNode);
            }
        }

        me.onRefreshStore();
        Toast(msg.join(''), null, null, 3000);

    },

    doDestroy() {
        this.destroyMembers('confirmMessageKey');
    }

})
