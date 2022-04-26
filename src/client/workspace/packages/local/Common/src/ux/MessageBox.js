Ext.define('Common.ux.MessageBox', {
    extend: 'Ext.Panel',
    xtype: 'uxmessagebox',
    requires: [
        'Ext.util.InputBlocker',
        'Ext.Responsive'
    ],
 
    config: {
        maximized: null,
        maximizable: null,
        iconCls: null,

        zIndex: 999,
        defaultTextHeight: 75,
 
        buttons: null,
        scrollable: 'y',

 
        message: null,
 
        prompt: null,
        layout: {
            type: 'vbox',
            pack: 'center'
        },
 
        multiLine: null,
        maxHeight: 600

    },
 
    responsiveConfig:{
        desktop:{
            minWidth: 300,
            maxWidth: 800,
        },
        phone:{
            minWidth: '90%',
            maxWidth: '90%'
        }
    },


    floated: true,
    modal: true,
    centered: true,
    shadow: true,
    hideMode: 'offsets',

    classCls: Ext.baseCSSPrefix + 'messagebox',
    closeAction: 'hide',
 
    headerCls: [
        Ext.baseCSSPrefix + 'dialogheader',
        Ext.baseCSSPrefix + 'messageboxheader'
    ],
 
    titleCls: [
        Ext.baseCSSPrefix + 'dialogtitle',
        Ext.baseCSSPrefix + 'messageboxtitle'
    ],
 
    toolCls: [
        Ext.baseCSSPrefix + 'paneltool',
        Ext.baseCSSPrefix + 'dialogtool',
        Ext.baseCSSPrefix + 'messageboxtool'
    ],
 
    statics: {
        INFO: Ext.baseCSSPrefix + 'msgbox-info',
        WARNING: Ext.baseCSSPrefix + 'msgbox-warning',
        QUESTION: Ext.baseCSSPrefix + 'msgbox-question',
        ERROR: Ext.baseCSSPrefix + 'msgbox-error',
 
        OK: { ok: 'me.onClick'},
        YES: { yes: 'me.onClick'},
        NO: { no: 'me.onClick' },
        CANCEL: { cancel: 'me.onClick' },
 
        OKCANCEL: {
            ok: 'me.onClick',
            cancel: 'me.onClick'
        },
 
        YESNOCANCEL: {
            yes: 'me.onClick',
            no: 'me.onClick',
            cancel: 'me.onClick'
        },
 
        YESNO: {
            yes: 'me.onClick',
            no: 'me.onClick'
        }
    },
 
    /**
     * @private
     */
    constructor(config) {
        let allowedConfigs = [
                'ui', 'showAnimation', 'hideAnimation', 'title', 'message', 'prompt',
                'iconCls', 'buttons', 'defaultTextHeight'
            ],
            ln, i, allowedConfig;
 
        config = config || {};
 
        if (config.hasOwnProperty('multiline') || config.hasOwnProperty('multiLine')) {
            config.prompt = config.prompt || {};
            Ext.applyIf(config.prompt, {
                multiLine: config.multiline || config.multiLine
            });
 
            delete config.multiline;
            delete config.multiLine;
        }
 
        this.defaultAllowedConfig = {};
        ln = allowedConfigs.length;
 
        for (i = 0; i < ln; i++) {
            allowedConfig = allowedConfigs[i];
            this.defaultAllowedConfig[allowedConfig] = this.defaultConfig[allowedConfig];
        }
 
        this.callParent([config]);
    },
 
    /**
     * Creates a new {@link Ext.Toolbar} instance using {@link Ext#factory}.
     * @private
     */
    applyTitle(config) {
        if (typeof config === "string") {
            return config;
        }
 
        return config.title;
    },
 
    /**
     * Adds the new {@link Ext.Toolbar} instance into this container.
     * @private
     */
    updateTitle(newTitle) {
        var header = this.getHeader() || {};
 
        if (Ext.isSimpleObject(header)) {
            header.title = newTitle;
            this.setHeader(header);
        }
        else if (Ext.isFunction(header.setTitle)) {
            header.setTitle(newTitle);
        }
    },
 
    /**
     * @private
     */
    applyMessage(config) {
        config = {
            maxHeight: 510,
            html: config,
            cls: this.baseCls + '-text'
        };
 
        return Ext.factory(config, Ext.Component, this._message);
    },
 
    /**
     * @private
     */
    updateMessage(newMessage) {
        if (newMessage) {
            this.add(newMessage);
        }
    },
 
    getMessage() {
        if (this._message) {
            return this._message.getHtml();
        }
 
        return null;
    },
 
    /**
     * @private
     */
    applyIconCls(config) {
 
        if (config) {
            config = {
                xtype: 'component',
                docked: 'left',
                width: 40,
                height: 40,
                hidden: (config) ? false : true,
                cls: Ext.baseCSSPrefix + 'icon ' + config
            };
 
            return Ext.factory(config, Ext.Component, this._iconCls);
        }
 
        return config;
    },
 
    /**
     * @private
     */
    updateIconCls(newIconCls, oldIconCls) {
        // ensure the title and button elements are added first
        this.getTitle();
        this.getButtons();
 
        if (newIconCls) {
            this.add(newIconCls);
        }
        else {
            this.remove(oldIconCls);
        }
    },
 
    getIconCls() {
        var icon = this._iconCls,
            iconCls;
 
        if (icon) {
            iconCls = icon.getCls();
 
            return (iconCls) ? iconCls[0] : null;
        }
 
        return null;
    },
 
    /**
     * @private
     */
    applyPrompt(prompt) {
        var config;
 
        if (prompt) {
            config = {
                label: false
            };
 
            if (Ext.isObject(prompt)) {
                Ext.apply(config, prompt);
            }
 
            if (config.multiLine) {
                config.height = Ext.isNumber(config.multiLine)
                    ? parseFloat(config.multiLine)
                    : this.getDefaultTextHeight();
 
                // eslint-disable-next-line dot-notation
                return Ext.factory(config, Ext.field['TextArea'], this.getPrompt());
            }
            else {
                // eslint-disable-next-line dot-notation
                return Ext.factory(config, Ext.field['Text'], this.getPrompt());
            }
        }
 
        return prompt;
    },
 
    /**
     * @private
     */
    updatePrompt(newPrompt, oldPrompt) {
        if (newPrompt) {
            this.add(newPrompt);
        }
 
        if (oldPrompt && !oldPrompt.destroyed) {
            this.remove(oldPrompt);
        }
    },
 
    /**
     * @private
     * Pass `fn` config to show method instead.
     */
    onClick(button) {
        var me = this,
            msgBoxOptions = me.msgBoxOptions,
            prompt = me.getPrompt(),
            fn = msgBoxOptions.fn,
            which;
        if (button) {
            if (typeof fn === 'function') {
                button.disable();
 
                prompt = prompt ? prompt.getValue() : null;
                which = button.getItemId() || button.getText();
 
                me.on({
                    single: true,
                    hiddenchange() {
                        fn.call(msgBoxOptions.scope || me, which, prompt, msgBoxOptions);
                        button.enable();
                    }
                });
            }
        }
 
        me.hide();
    },
 
    show(msgBoxOptions, options) {
        let me = this,
            buttons, config, prompt;
 
        Ext.util.InputBlocker.blockInputs();
 
        if (!msgBoxOptions) {
            return me.callParent(arguments);
        }
 
        config = Ext.apply({
            buttons: Common.ux.MessageBox.OK,
            draggable: false,
            prompt: null,
            defaultFocus: null
        }, msgBoxOptions);
 
        if (config.multiLine) {
            config.prompt = config.prompt || {};
            config.prompt.multiLine = config.multiLine;
            delete config.multiLine;
        }
 
        delete config.value;
        delete config.fn;
        delete config.scope;
 
        config = Ext.merge({}, me.defaultAllowedConfig, config);
 
        me.setConfig(config);
        me.msgBoxOptions = msgBoxOptions;
 
        buttons = me.getButtons();
        buttons.items.each(function(btn) {
            var value;
 
            if (btn.isButton) {
                value = btn.getScope();
 
                if (btn.fn && value) {
                    btn.fn = btn.fn.bind(value);
                }
 
                value = btn.getHandler();
 
                if (!value || value === 'me.onClick') {
                    btn.setHandler('onClick');
                    btn.setScope(me);
                }
            }
        });
 
        prompt = me.getPrompt();
 
        if (prompt) {
            prompt.setValue(msgBoxOptions.value || '');
        }
 
        me.callParent([null, options]);
 
        return me;
    },
 
    alert(title, message, fn, scope) {
        return this.show({
            title: title || I18N.getDefaultMessageTitle(),
            message: message || null,
            buttons: Common.ux.MessageBox.OK,
            defaultFocus: '#ok',
            prompt: false,
            fn: function() {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            },
            scope: scope
        });
    },
 
    confirm(title, message, fn, scope) {
        return this.show({
            title: title || I18N.getDefaultMessageTitle(),
            message: message || null,
            buttons: Common.ux.MessageBox.YESNO,
            defaultFocus: '#yes',
            prompt: false,
            scope: scope,
 
            fn: function() {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            }
        });
    },
 
    prompt(title, message, fn, scope, multiLine, value, prompt) {
        return this.show({
            title: title || I18N.getDefaultMessageTitle(),
            message: message || null,
            buttons: Common.ux.MessageBox.OKCANCEL,
            scope: scope,
            prompt: prompt || true,
            defaultFocus: 'textfield',
            multiLine: multiLine,
            value: value,
 
            fn: function() {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            }
        });
    }
}, function(MessageBox) {
    Ext.onInternalReady(function() {
        window.MsgBox = Ext.create('Common.ux.MessageBox');
    });
});