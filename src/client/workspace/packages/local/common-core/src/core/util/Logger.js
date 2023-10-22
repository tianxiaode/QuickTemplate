Ext.define('Common.core.util.Logger', {
    alternateClassName: 'Logger',
    singleton: true,

    levelMap:{
        none: 0,
        verbose: 1,
        error : 2,
        warn : 3,
        info: 4,
        debug: 5
    },

    levels:['none', 'verbose', 'error', 'warn', 'info', 'debug'],

    config:{
        level : 'none',
        logger: console
    },


    constructor(config){
        this.initConfig(config);
    },

    log(level, ...args){
        let me = this,
            levelString = me.getLevel(),
            currentLevel = me.levelMap[levelString],
            priority = me.levels[level],
            logger = me.getLogger();
        if(!logger){
            Ext.raise(`Invalid logger: ${logger}`);
        }
        if (!priority || !(priority in logger)) {
            priority = 'log';
        }
        if(level >= currentLevel){
            logger[priority]('[' + priority.toUpperCase() + '] ', ...args);
        }

        console.log(priority, ...args);

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

    verbose(...args){
        this.log(this.levelMap.verbose, args);
    },

    destroy() {
        let me = this;
        me.destroyMembers('levelMap', 'levels');
        me.setLogger(null);
        me.callParent();
    }


})