Ext.define('Common.overrides.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    // applyItemTpl(config) {
    //     // let tpl = null,
    //     //     last = null;
    //     // if (Ext.isString(config)) {
    //     //     last = {};
    //     //     tpl = [config];
    //     // } else if (Ext.isArray(config)) {
    //     //     let ln = config.length;
    //     //     last = config[ln - 1];
    //     //     if (Ext.isString(last)) {
    //     //         last = {};
    //     //         tpl = config;
    //     //     } else if (Ext.isObject(last)) {
    //     //         tpl = config.slice(0, ln - 1);
    //     //     }
    //     // }
    //     let tpl = Ext.XTemplate.get(config);
    //     Logger.debug(this.applyItemTpl, tpl);
    //     // Ext.each(Template.fn, name=>{
    //     //     tpl.pr.fn[name] = Ext.bind(Format[name], this, [], true);
    //     // })
    //     //tpl.push(last);
    //     //Logger.debug(this.applyItemTpl, Ext.clone(tpl));

        
    //     return tpl;
    // }


});