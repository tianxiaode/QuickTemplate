Ext.define('Common.ux.crud.controller.mixin.Batch',{
    extend: 'Ext.Mixin',

    messageTemplate: null , //信息模板

    /**
     * 获取多实体远程操作数据
     * @param {获取提交数据的函数} getDataFn
     */
    getBatchData(getPostDataFn){
        let me = this,
            store = me.getStore(),
            messageField = store.messageField,
            selections = me.getSelections(),
            data = { ids: [], contents: [] };
        getPostDataFn = getPostDataFn || me.getPostDataFn;
        //组织数据
        selections.forEach(r=>{
            let value = r.get(messageField);
            data.contents.push(value);
            getPostDataFn.apply(me, [data.ids, r]);

        });
        return data;
    },

    getPostDataFn(data, record){
        data.push(record.getId());
    },

    /**
     * 执行多个实体的远程操作
     * @param {确认窗口标题} confirmTitle 
     * @param {确认信心} confirmMessage 
     * @param {要执行的操作} action 
     * @param {信息内容} contents 
     */
    doBatch(confirmTitle, confirmMessage, action, getPostDataFn, successFn, failureFn){
        let me = this;

        //如果没有选择，显示提示
        if(!me.hasSelections(true)) return;

        let data = me.getBatchData(getPostDataFn);

        //确认后执行操作
        MsgBox.confirm(
            confirmTitle,
            Format.format(confirmMessage, me.getMessageTpl().apply(data.contents)),
            function (btn) {
                if (btn !== "yes") return;
                action.apply(me,[data])
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
    getMessageTpl(){
        var me = this,
            template = me.messageTemplate;
        if(template) return template;
        template = me.messageTemplate = Template.getTpl('messageList');
        return template;
    },

    /**
     * 执行多实体远程操作成功的回调函数
     * @param {响应} response 
     * @param {远程调用参数}} opts 
     */
    doBatchSuccess(response){
        let me = this,
            store = me.getStore(),
            messageField = store.messageField,
            isDelete = response.request.method === 'DELETE',
            resultMsg = isDelete ? I18N.get("DeleteSuccess") : I18N.get('UpdateSuccess'),
            obj = Http.parseResponse(response), 
            msg = ['<ul class="message-tips">'],
            items = obj && obj.items;
        Ext.Viewport.unmask();
        if(!items){
            me.onRefreshStore();
            Toast(resultMsg,null,null, 3000);
            return;
        }
        items.forEach(m=>{
            let text = Ext.isObject(m) ? m[messageField] || m.name || m.displayName : m;
            msg.push(`<li class="success">${text}:  ${resultMsg}</li>`);
        })
        msg.push('</ul>');

        if(isDelete && store.isTreeStore){
            let selection = me.getSelections()[0];
            if(selection){
                me.getSelectable().select(selection.parentNode);
            }
        }

        me.onRefreshStore();
        Toast(msg.join(''),null,null, 3000);

    },

})
