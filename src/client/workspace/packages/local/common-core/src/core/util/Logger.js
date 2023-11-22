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
        logger: console,
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
            if(Ext.isFunction(first)){
                args = args.slice(1);
                let owner = first.$owner;
                if(owner && owner.$className){
                    prefix += `[${owner.$className}] `;
                }
                prefix += `[${first.name}]`;
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

    getCaller(){
        let me = this;
        if(me.currentClass && me.cureentMethodName){
            return `[${me.currentClass.$className}] [${me.cureentMethodName}] `;
        }
        return '';

    },

    destroy() {
        let me = this;
        me.destroyMembers('levelMap', 'levels', 'currentClass');
        me.setLogger(null);
        me.callParent();
    }


})