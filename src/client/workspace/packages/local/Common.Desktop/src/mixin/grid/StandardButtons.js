/**
 * 为面板混入操作按钮
 */
Ext.define('Common.Desktop.mixin.grid.StandardButtons', {
    mixinId: 'standardButtonsMixin',


    requires:[
        'Common.Shared.ux.field.Search',
        'Common.Desktop.ux.button.Refresh',
        'Common.Desktop.ux.button.Trash',
        'Common.Desktop.ux.button.First',
        'Common.Desktop.ux.button.Previous',
        'Common.Desktop.ux.button.Next',
        'Common.Desktop.ux.button.Last',
        'Common.Desktop.ux.button.Create',
        'Common.Desktop.ux.button.Edit',
    ],

    config:{

        //从panel添加的属性
        buttonAlign: null,

        buttonDefaults: null,

        standardButtons:{
            first:{
                xtype: 'uxfirstbutton',
                isPaging: true,
                disabled: true,
                weight: 10,
                handler: 'onPagingMoveFirst',
            },
            prev:{
                xtype: 'uxpreviousbutton',
                isPaging: true,
                disabled: true,
                weight: 20,
                handler: 'onPagingMovePrevious'
            },
            pageNumber:{
                xtype: 'numberfield',
                isPaging: true,
                weight: 30,                
                width: 60,
                clearable: false,
                minValue: 1,
                decimals:0,
                value:1
                // listeners:{
                //     blur: 'onPagingBlur',
                //     keyup: 'onPageNumberKeyup'
                // }
            },
            pageCount:{
                xtype: 'component',
                isPaging: true,
                weight: 40,
                html: '/ 0'
            },
            next:{
                xtype: 'uxnextbutton',
                disabled: true,
                isPaging: true,
                weight: 50,
                handler: 'onPagingMoveNext'
            },
            last:{
                xtype: 'uxlastbutton',
                isPaging: true,
                disabled: true,
                weight: 60,
                handler: 'onPagingMoveLast'
            },
            create:{
                xtype: 'uxcreatebutton',
                weight: 70,
                hidden: true,
                handler: 'onAddedEntity', 
            },
            edit:{
                xtype: 'uxeditbutton',
                weight: 80,
                hidden: true,
                disabled:true,
                handler: 'onEditedEntity', 
            },
            delete:{
                xtype: 'uxtrashbutton',
                weight: 90,
                hidden: true,
                disabled:true,
                handler: 'onDeletedEntity', 
            },
            refresh:{
                xtype: 'uxrefreshbutton',
                weight: 100,
                handler: 'onRefreshStore', 
            },
            search: {
                weight: 110,
                xtype: 'uxsearchfield',
                isSearch: true,
                searchName: 'query'
            },
            fill:{
                xtype: 'component',
                flex:1,
                weight: 120,
            },
            countMessage:{
                weight: 130,
                xtype: 'component'
            }    
        }

    },

    cachedConfig: {
        buttonToolbar: {
            xtype: 'container',
            //itemId: 'buttonToolbar',
            docked: 'top',
            defaultType: 'button',
            weighted: true,
            padding: '5px 10px',
            defaults: {
                margin: '0 10px 0 '
            },
            border: true,
            shadow: false,
            style: 'background-color:#fff;border-bottom:1px solid var(--divider-color);',
                
            layout: {
                type: 'box',
                vertical: false,
                pack: 'left'
            }
        }
    },

    updateButtonAlign: function(buttonAlign) {
        var pack;

        if (buttonAlign && this._buttons) {
            pack = this._packButtonAlign[buttonAlign];

            if (pack) {
                this._buttons.getLayout().setPack(pack);
            }
        }
    },

    // updateStandardButtons: function(buttons){
    //     let me = this;
    //     if(buttons){
    //         Object.keys(buttons).forEach(key=>{
    //             let button = buttons[key];
    //             let prototype = Object.getPrototypeOf(button);
    //             if(!prototype.isPaging) return;
    //             if(prototype.handler && typeof prototype.handler === 'string'){
    //                 prototype.handler = me[prototype.handler];
    //                 prototype['scope'] = me;
    //             }else if(prototype.listeners && typeof prototype.listeners === 'object'){
    //                 Object.keys(prototype.listeners).forEach(event=>{
    //                     let method = prototype.listeners[event]
    //                     prototype.listeners[event] = me[method];
    //                 });
    //                 prototype.listeners['scope'] = me;
    //             }
    //         })
    //     }
    //     return buttons;
    // },


    applyButtons: function(buttons, oldButtons) {
        let me = this,
            array = Ext.convertKeyedItems(buttons, 'xxx', 'xxx'), // to detect handlers
            buttonDefaults = Ext.clone(me.getButtonDefaults()),
            standardButtons = Ext.clone(me.getStandardButtons()),
            toolbar = Ext.clone(me.getButtonToolbar()),
             n = array ? array.length : 0,
             button, defaults, handler, i;

        if (buttons && typeof buttons === 'object') {
            if (buttons.xtype || buttons.itemId || buttons.items || buttons.reference) {
                // Single config object is understood to be the toolbar not a single
                // buttom...
                return me.normalizeDockedBars(buttons, oldButtons, 'top', toolbar);
            }
        }
        if (buttons) {
            if (array === buttons) { // if (wasn't an object)
                array = [];

                for (i = 0; i < n; ++i) {
                    button = buttons[i];

                    if (typeof button === 'string') {
                        if (!Ext.Toolbar.shortcuts[button]) {
                            button = Ext.applyIf({
                                itemId: button,
                                text: button
                            }, buttonDefaults);
                        }
                    }
                    else if (buttonDefaults) {
                        button = Ext.apply({}, button, buttonDefaults);
                    }

                    array[i] = button;
                }
            }
            else {
                // convertKeyedItems has already shallow copied each item in order
                // to place in the itemId, so leverage that... It has also promoted
                // string items like 'foo' in to objects like { xxx: 'foo' } so we
                // can make sure they have buttonDefaults
                for (i = 0; i < n; ++i) {
                    button = array[i];
                    handler = button.xxx;
                    defaults = standardButtons[button.itemId];

                    if (defaults) {
                        Ext.applyIf(button, defaults);
                        // ok: 'onOK'  ==> { handler: 'onOK', text: 'OK', weight: 10 }
                    }
                    //<debug>
                    else if (handler) {
                        Ext.raise(
                            'Button handler short-hand is only valid for standardButtons');
                    }
                    //</debug>

                    if (handler) {
                        delete button.xxx;
                        button.handler = handler;
                        // ok: 'onOK'  ==> { handler: 'onOK' }
                    }

                    if (buttonDefaults) {
                        Ext.applyIf(button, buttonDefaults);
                    }
                }
            }
        }

        return me.normalizeDockedBars(array, oldButtons, 'top', toolbar);
    },

    privates:{
        normalizeDockedBars: function(
            toolbar, previous, pos, buttonToolbarCfg, disableFocusableContainer) {
            var me = this,
                isComponent, buttonAlign, buttonToolbarDefaults,
                index, layout, pack;
            if (!toolbar) {
                if (previous) {
                    previous.destroy();
                }

                return toolbar;
            }

            isComponent = toolbar.isComponent;

            if (Ext.isArray(toolbar)) {
                toolbar = {
                    xtype: 'toolbar',
                    items: toolbar
                };
            }
            else if (!isComponent) {
                // Incoming toolbar config can be a property on the prototype
                toolbar = Ext.clone(toolbar);
            }

            if (!toolbar.xtype) {
                toolbar.xtype = 'toolbar';
            }

            if (isComponent) {
                toolbar.setDocked(pos);
            }
            else {
                toolbar.docked = pos;
            }

            if (disableFocusableContainer) {
                if (isComponent) {
                    toolbar.setEnableFocusableContainer(false);
                }
                else {
                    toolbar.enableFocusableContainer = false;
                }
            }

            // Support for buttonAlign (only used by buttons)
            if (buttonToolbarCfg && !isComponent) {
                toolbar = Ext.merge(Ext.clone(buttonToolbarCfg), toolbar);
                toolbar.layout = Ext.merge(layout = {}, toolbar.layout);

                buttonAlign = me.getButtonAlign();

                if (buttonAlign) {
                    pack = me._packButtonAlign[buttonAlign];

                    if (pack) {
                        layout.pack = pack;
                    }
                }

                buttonToolbarDefaults = toolbar.defaults;

                toolbar.defaults = function(config) {
                    var defaults = buttonToolbarDefaults || {},
                        // no xtype or a button instance
                        isButton = !config.xtype || config.isButton,
                        cls;

                    // Here we have an object config with an xtype, check if it's a button
                    // or a button subclass
                    if (!isButton) {
                        cls = Ext.ClassManager.getByAlias('widget.' + config.xtype);

                        if (cls) {
                            isButton = cls.prototype.isButton;
                        }
                    }

                    return defaults;
                };
            }

            if (previous) {
                // Since these fellows will often have the same itemId, we need to
                // remove the remove toolbar before adding the new one.
                index = me.indexOf(previous);
                previous.destroy();
                toolbar = me.insert(index, toolbar);
            }
            else {
                toolbar = me.insert(0,toolbar);
            }

            return toolbar;
        },

    }

});