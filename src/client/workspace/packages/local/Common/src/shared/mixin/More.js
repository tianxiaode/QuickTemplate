Ext.define('Common.shared.mixin.More', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            initialize: 'initialize',
        },
        after:{
            updateRecord: 'updateRecord'
        }
    },

    hasInfoCmp: true,
    remoteData: false,
    config: {
        url: null,
        infoTpl: null,
        entityName: null,
        info:{
            xtype: 'component',
            flex:1
        },
        errorInfo:{
            xtype: 'errorinfo'
        },

    },

    layout: 'vbox',
    currentId: null,

   
    applyInfoTpl(config){
        if(!config) return config;
        return Template.getTplWithScope(config, this);
    },

    createComponent(newCmp) {
        return Ext.apply({
            ownerCmp: this
        }, newCmp);
    },

    applyInfo(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    applyErrorInfo(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createComponent');
    },

    initialize(){
        let me = this;
        if(me.hasInfoCmp) me.infoCmp = me.add(me.getInfo());
        me.errorCmp = me.add(me.getErrorInfo());
        
    },


    updateRecord(record){
        let me = this;
        if(!record) {
            me.onBack();
        };
        me.clearInfo()
        me.onSwitchTitle();
        if(me.remoteData){
            me.loadData(me,record);
            return record;
        }
        me.showInfo(record.data);
        return record;
    },

    loadData(me, record){
        let id = record.getId();
        if(me.currentId === id) return;
        me.currentId = id;
        let url = me.getUrl(),
            entityName = me.entityName || (me.getEntityName && me.getEntityName);
        if(Ext.isEmpty(url)) url = URI.crud(entityName, record.getId());
        me.mask(I18N.get('LoadingText'));
        Http.get(url, me.getParams()).then(me.getViewDataSuccess, me.getViewDataFailure, null,me);

    },

    clearInfo : Ext.emptyFn,
    getViewDataSuccess(response){
        let me = this,
            data = Http.parseResponseText(response),
            errorCmp = me.errorCmp;
        me.unmask();
        me.clearInfo();
        errorCmp.setHidden(true);
        me.showInfo(data.result);
    },

    getViewDataFailure(response){
        let me = this,
            errorCmp = me.errorCmp,
            error = Failure.getError(response);
        me.unmask();
        if(me.infoCmp) me.infoCmp.setHtml('');
        errorCmp.setHidden(false);
        errorCmp.setHtml(error);
    },

    showInfo(data){
        let me = this;
        if(me.infoCmp) me.infoCmp.setHtml(me.getInfoTpl().apply(data));
    },

    getParams(){return null},

    onSwitchTitle: Ext.emptyFn

});