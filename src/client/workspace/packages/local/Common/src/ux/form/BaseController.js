Ext.define('Common.ux.form.BaseController',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.formbasecontroller',

    init(){
        let me = this,
            view = me.getView();
        me.entityName = view.getEntityName();
        me.resourceName = view.getResourceName();
        if(Ext.platformTags.desktop) me.initEnterEvent();
        view.on('hiddenchange', me.initFormState ,me);
    },

    allEnterFields:null,
    autoClose: true,
    fireSavedEvent: true,
    savedText: 'SavedAndExit',


    /**
     * 初始化回车事件
     */
    initEnterEvent(){
        let me = this;
        let view = me.getView();
        if(view.getAutoTabIndex()){
            let fields = me.allEnterFields = view.query('field[focusable]:not([hidden]):not(textfield):not(containerfield):not([disabled]):not([readOnly])');
            let index=0;
            fields.forEach(f=>{
                f.setTabIndex(index+1);
                f.setKeyMapEnabled(true);
                f.setKeyMap({
                    enter: {
                        handler: me.doEnterNextField,
                        scope: me
                    } 
                });
                index++;
            })
        }
    },

    /**
     * 回车后，焦点移动到下一个字段
     * @param {事件} event 
     * @param {字段} field 
     */
    doEnterNextField(event, field) {
        event.preventDefault();
        let me =  this,
            fields = me.allEnterFields,
            index = field.getTabIndex(),
            next = fields.find(f=>{
                return f.getTabIndex()>index && !field.getHidden() && !field.getReadOnly();
            });
        if(next)  {
            next.focus();
            return false;
        }
        me.onSave();
        return false;
    },

    /**
     * 初始化表单状态
     * @param {事件触发者} sender 
     * @param {值} value 
     * @param {旧值} oldValue 
     * @param {事件参数} eOpts 
     */
    initFormState(sender, value, oldValue, eOpts){
        if(value) return;
        let me = this,
            view = me.getView();
        me.hasNew = false;
        me.saved = false;
        view.hideMessageButton();
        view.clearErrors();
        Ext.platformTags.desktop && me.initFocus(view);
        me.initParams(view);
    },

    initParams: Ext.emptyFn,
    
    /**
     * 初始化焦点
     */
    initFocus(view){
        let field = view.down('field[tabIndex]:not([readOnly])');
        if(field) field.focus();    
    },

    /**
     * 重置
     */
    onReset(){
        let me = this,
            view = me.getView();
        view.reset(true);
        //me.getMessageButton().setHidden(true);
        me.initFocus(view);
    },


    /**
     * 关闭
     */
    onHide(){
        let me = this,
            view = me.getView();
        view.hide();
        if(!Ext.isEmpty(view.backView)){
            Ext.History.back();
        }
    },

    onCancel(){
        let me = this,
            view = me.getView();
            view.fireEvent('canceledit', me, me.hasNew);
        me.onHide();
    },


    onBack(){
        this.onCancel();
    },

    /**
     * 提交失败后的操作
     * @param {响应} response 
     * @param {操作} eOpts 
     */
    onSubmitFailure(response, eOpts) {
        let me = this,            
            view = me.getView(),
            status = response && response.status,
            error;
        view.unmask();
        if(status === 400){
            me.setErrors(me, view, response.responseJson || Http.parseResponse(response));
            return;
        }
        error = Http.getError(response, me.resourceName);
        view.showMessage(error, true);
    },

    setErrors(me,view, data){
        let resourceName = me.resourceName,
            errors = Http.getValidationErrors(data, resourceName);
        for(let fieldName in errors){
            let f = view.down(`field[name=${fieldName}]`);
            if(Ext.isArray(f) || Ext.isEmpty(f) || (f && f.isCheckbox) ) continue;
            let message = errors[fieldName];
            if (message === null || (Ext.isArray(message) && message.length === 0)) {
                f.setError(null);
            }
            else {
                f.setError(message);
            }
        }
        errors = me.buildValidationErrors(errors);
        view.showMessage(errors, true);
    },

    onSubmitSuccess(response){
        let me = this,
            view = me.getView();
        view.unmask();
        view.showMessage(I18N.get(me.savedText), false);
        if(me.fireSavedEvent) view.fireEvent('saved');
        me.lazyClose();
    },
    

    lazyClose(fn){
        Ext.defer(this.onHide, 2000, this);
    },

    /**
     * 保存前执行的操作
    */
    beforeFormSave(view){ 
        if (!view.validate()) {
            let me = this,
                errors = view.getErrors(),
                msg = me.buildValidationErrors(errors);
            view.showMessage(msg, true);
            return false;
        };
        return true;
    },
    

    onSave: Ext.emptyFn,

    buildValidationErrors(errors){
        let me = this,
            view = me.getView(),
            resourceName = me.resourceName;
            msg = '<ul class="message-tips">';
        Ext.iterate(errors,(fieldName, error)=>{            
            if(!Ext.isArray(error)) return;
            let field = view.down(`[name='${fieldName}']`),
                label = field.getLabel() || field.getBoxLabel() || I18N.get(fieldName, resourceName);
            msg += `<li class="text-danger lh-20"><b>${label}</b>： ${error.join('<br>')}</li>`;
            
        })
        msg += '</ul>'
        return msg;
    },


})