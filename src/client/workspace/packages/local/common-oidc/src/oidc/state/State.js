Ext.define('Common.oidc.state.State', {
    alias: 'oidc.state.state',

    requires: [
        'Common.core.service.Storage',
        'Common.core.util.Logger'
    ],

    id: null,
    created: null,
    requestType: null,


    statics: {

        fromStorageString(storageString) {
            return Ext.create('oidc.state.state', JSON.parse(storageString));
        },

        async clearStaleState(storage, age) {
            let State = Common.oidc.state.State,
                cutoff = Oidc.Timer.getEpochTime() - age,
                keys = await storage.getAllKeys(),
                ln = keys.length;
            Logger.debug(State.clearStaleState, 'got keys', keys);
            for (let i = 0; i < ln; i++) {
                let key = keys[i];
                let item = await storage.get(key);
                let remove = false;

                if (item) {
                    try {
                        let state = await State.fromStorageString(item);

                        Logger.debug(State.clearStaleState, "got item from key:", key, state.created);
                        if (state.created <= cutoff) {
                            remove = true;
                        }
                    }
                    catch (err) {
                        Logger.error(State.clearStaleState, "Error parsing state for key:", key, err);
                        remove = true;
                    }
                }
                else {
                    Logger.debug(State.clearStaleState, "no item in storage for key:", key);
                    remove = true;
                }

                if (remove) {
                    Logger.debug(State.clearStaleState, "removed item for key:", key);
                    storage.remove(key);
                }
            }
        }
    },

    constructor(config) {
        let me = this;
        Ext.apply(me, config);
        me.id = config.id || Oidc.Crypto.generateUUIDv4();
        me.data = config.data;

        if (config.created && config.created > 0) {
            me.created = config.created;
        } else {
            me.created = Oidc.Timer.getEpochTime();
        }
        me.requestType = config.requestType;
    },

    toStorageString() {
        let me = this;
        return JSON.stringify({
            id: me.id,
            data: me.data,
            created: me.created,
            requestType: me.requestType
        });
    }

})
