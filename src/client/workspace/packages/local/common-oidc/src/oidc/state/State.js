Ext.define('Common.oidc.state.State',{
    alias: 'oidc.state.state',

    requires:[
        'Common.core.service.Storage',
        'Common.core.util.Logger'
    ],

    id: null,
    created: null,
    requetType: null,
    

    statics:{
        
        fromStorageString(storageString){
            return Ext.create('oidc.state', JSON.parse(storageString));
        },

        async clearStaleState(storage, age){
            let State = Common.oidc.State,
                cutoff = Format.getEpochTime() - age,
                keys = await storage.getAllKeys(),
                ln = keys.length;
            Logger.debug('got keys', keys);
            for (let i = 0; i < ln; i++) {
                let key = keys[i];
                let item = storage.get(key);
                let remove = false;
    
                if (item) {
                    try {
                        let state = State.fromStorageString(item);
    
                        Logger.debug(me, "got item from key:", key, state.created);
                        if (state.created <= cutoff) {
                            remove = true;
                        }
                    }
                    catch (err) {
                        Logger.error(me, "Error parsing state for key:", key, err);
                        remove = true;
                    }
                }
                else {
                    Logger.debug(me, "no item in storage for key:", key);
                    remove = true;
                }
    
                if (remove) {
                    Logger.debug(me ,"removed item for key:", key);
                    storage.remove(key);
                }
            }
        }
    },

    constructor(config) {
        let me = this;
        Ext.apply(me, config);
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
        });
    }

})
