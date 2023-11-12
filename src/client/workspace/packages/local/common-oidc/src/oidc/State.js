Ext.define('Common.odic.State',{
    alias: 'odic.state',

    requires:[
        'Common.core.service.Storage'
    ],

    id: null,
    created: null,
    requetType: null,

    statics:{
        fromStorageString(storageString){
            return Ext.create('oidc.state', JSON.parse(storageString));
        },

        clearStaleState(age){
            let cutoff = Format.getEpochTime() - age;

            
        }
    },

    constructor(config) {
        let me = this;
        me.id = config.id || Ext.data.identifier.Uuid.Global.generate();
        me.data = config.data;

        if(config.created && config.created>0){
            me.created = config.created;
        }else{
            me.created = Format.getEpochTime();
        }
        me.requetType = config.requetType;
    },

    toStorageString(){
        let me = this;
        return JSON.stringify({
            id: me.id,
            data: me.data,
            created: me.created,
            requetType: me.requetType
        })
    },




})
