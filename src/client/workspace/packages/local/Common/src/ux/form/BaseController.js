Ext.define('Common.ux.form.BaseController',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.shared-formbasecontroller',

    mixins:[
        'Common.mixin.Messageable',
    ],

    init(){
        let me = this,
            view = me.getView();
        me.entityName = view.entityName || (view.getEntityName && view.getEntityName());
        me.resourceName = view.resourceName || Format.pluralize(me.entityName);
        if(Ext.platformTags.desktop) me.initEnterEvent();
        view.on('hiddenchange', me.initFormState ,me);
    },

    allEnterFields:null,
    autoClose: true,
    fireSavedEvent: true,


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
         me.getMessageButton().setHidden(true);
         me.getView().clearErrors();
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

   onErrorOrSuccessTap(sender){
       if(Ext.platformTags.phone) sender.getTooltip().show();
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
        me.showMessage(error, true);
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
        errors = Http.buildValidationErrors(errors, resourceName);
        me.showMessage(errors, true);
    },

    onSubmitSuccess(response){
        let me = this,
            view = me.getView();
        view.unmask();
        me.showMessage(I18N.get('SavedAndExit'), false);
        if(me.fireSavedEvent) view.fireEvent('saved');
        me.lazyClose();
    },
    

    lazyClose(fn){
        Ext.defer(this.onHide, 2000, this);
    },

    onSave: Ext.emptyFn

})