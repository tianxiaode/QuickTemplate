/**
 * 改类用于组合混入组件配置项并销毁混入组件及其配置
 */
Ext.define('Common.mixin.ComponentCreator', {
    extend: 'Common.mixin.Base',

    mixinComponents: null,
    buttonScope: null,

    getComponentConfig(config) {
        let me = this,
            mixinName = config.mixinName,
            type = me.getComponentType(mixinName),
            xtype = config.xtype,
            defaults = me.getDefaults() || {};
        if (type.isButton || type.isTool) {
            let buttonScope = me.buttonScope;
            if(!xtype) config.xtype = type.isButton ? 'button' : 'tool';
            if(buttonScope && !config.scope) config.scope = buttonScope;
        }
        if(type.isList && config.actionColumnScope){
            config.actionColumnScope = me;
        }

        if(type.isToolbar && config.buttonScope){            
            config.buttonScope = xtype === 'uxcrudmultilinetoolbar' ? me.up('[multilineToolbar]') : me;
        }

        if(type.isSearchField && Ext.platformTags.desktop){
            if(!config.width) config.width = 200;
        }

        me.addMixinComponent(mixinName);
        return Ext.apply({ ownerCmp: me }, config, defaults);

    },

    getComponentType(mixinName){
        return {
            isTool: mixinName.includes('Tool'),
            isButton: mixinName.includes('Button'),
            isToolbar: mixinName.includes('toolbar'),
            isSpacers: mixinName.includes('spacer'),
            isList: mixinName.includes('list'),
            isSearchField: mixinName.includes('searchfield')
        }
    },

    addMixinComponent(mixinName) {
        let me = this;
        if (!me.mixinComponents) {
            me.mixinComponents = [mixinName];
            return;
        }
        me.mixinComponents.push(mixinName);
    },

    doDestroy() {
        Ext.each(this.mixinComponents, name => {
            let defaultsName = `${name}Defaults`;
            this.destroyMembers(name, defaultsName);
            Logger.debug(this.doDestroy, name, defaultsName);
        })
        this.destroyMembers('buttonScope', 'mixinComponents');
        Logger.debug(this.doDestroy, Ext.clone(this));
    }


});