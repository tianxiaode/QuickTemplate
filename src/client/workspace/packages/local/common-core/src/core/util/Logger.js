Ext.define('Common.core.util.Logger', {
    alternateClassName: 'Logger',
    singleton: true,

    levelMap:{
        none: 0,
        error : 1,
        warn : 2,
        info: 3,
        debug: 4
    },

    levels:['none', 'error', 'warn', 'info', 'debug'],

    config:{
        level : 0,
        logger: console
    },

    applyLevel(level){
        if(Ext.isString(level)) return this.levelMap[level] ?? 3;
        return level;
    },


    constructor(config){
        this.initConfig(config);
    },

    log(outLevel, ...args){
        let me = this,
            level = me.getLevel(),
            priority = me.levels[outLevel],
            logger = me.getLogger(),
            prefix;
        if(!logger){
            Ext.raise(`Invalid logger: ${logger}`);
        }
        if (!priority || !(priority in logger)) {
            priority = 'log';
        }
        if(level >= outLevel){
            prefix = `[${priority.toUpperCase() }]`;
            let first = args[0];
            if(Ext.isObject(first) || Ext.isFunction(first)){
                if(first.name){
                    return logger[priority](prefix, `[${first.name}]`, ...args);
                }
                if(first.$className){
                    return logger[priority](prefix, `[${first.$className}]`, ...args);
                }
            }
            logger[priority](prefix, ...args);

        }
    },

    debug(...args){
        this.log(this.levelMap.debug, ...args);
    },

    info(...args){
        this.log(this.levelMap.info, ...args);
    },

    warn(...args){
        this.log(this.levelMap.warn, ...args);
    },

    error(...args){
        this.log(this.levelMap.error, ...args);
    },

    destroy() {
        let me = this;
        me.destroyMembers('levelMap', 'levels');
        me.setLogger(null);
        me.callParent();
    }


})