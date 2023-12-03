Ext.define('Common.ux.Toast', {
    extend: 'Ext.Sheet',
 
    requires: [
        'Ext.util.InputBlocker'
    ],

    minWidth: 300,
    userCls: 'uxToast',
    config: {
        /**
         * @cfg centered
         * @inheritdoc
         */
        centered: false,
 
        /**
         * @cfg showAnimation
         * @inheritdoc
         */
        showAnimation: {
            type: 'popIn',
            duration: 500,
            easing: 'ease-out'
        },
 
        /**
         * @cfg hideAnimation
         * @inheritdoc
         */
        hideAnimation: {
            type: 'popOut',
            duration: 500,
            easing: 'ease-out'
        },
 
        /**
         * Override the default `zIndex` so it is normally always above positioned components.
         */
        zIndex: 999,
 
        /**
         * @cfg {String} message
         * The message to be displayed in the {@link Ext.Toast}.
         * @accessor
         */
        message: '',
 
        /**
         * @cfg {Number} timeout
         * The amount of time in milliseconds to wait before destroying the toast automatically
         */
        timeout: 3000,
 
        /**
         * @cfg {Boolean/Object} messageAnimation
         * The animation that should be used between toast messages when they are queued up
         */
        messageAnimation: false,
 
        /**
         * @cfg hideOnMaskTap
         * @inheritdoc
         */
        hideOnMaskTap: true,
 
        /**
         * @cfg modal
         * @hide
         */
        modal: false,
 
        /**
         * @cfg layout
         * @inheritdoc
         */
        layout: {
            type: 'vbox',
            pack: 'center'
        }
    },
 
    /**
     * @property classCls
     * @inheritdoc
     */
    classCls: Ext.baseCSSPrefix + 'toast',
 
    /**
     * @private
     */
    applyMessage(value) {
        let config = {
            html: value,
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
 
    /**
     * @private
     */
    startTimer() {
        var timeout = this.getTimeout();
 
        if (this._timeoutID) {
            Ext.undefer(this._timeoutID);
        }
 
        if (!Ext.isEmpty(timeout)) {
            this._timeoutID = Ext.defer(this.onTimeout.bind(this), timeout);
        }
        else {
            this.onTimeout();
        }
    },
 
    stopTimer() {
        Ext.undefer(this._timeoutID);
        this._timeoutID = null;
    },
 
    /**
     * @method
     * @private
     */
    next: Ext.emptyFn,
 
    getIsAnimating() {
        var messageContainer = this.getMessage();
 
        return (messageContainer && Ext.Animator.hasRunningAnimations(
            messageContainer)) || Ext.Animator.hasRunningAnimations(this);
    },

    beforeShow(){
        this.setLeft(-10000);
        return true;
    },

    afterShow(){
        var me = this,
            el = me.el,
            activeToasts = me.getToasts(),
            length = activeToasts.size,
            sibling = length && [...activeToasts][length - 1],
            height = me.el.getHeight();
        if (sibling) {
            let siblingHeight = sibling.el.getHeight();
            el.alignTo(sibling.el, 'bl', [0, -height-siblingHeight-10]);
        }else {
            el.alignTo( me.anchor.el, me.anchorAlign,[40, -(height+10)]);
        }
        activeToasts.add(me);
        me.startTimer();

    },
 
    /**
     * @private
     */
    showToast(config) {
        var me = this,
            message = config.message,
            timeout = config.timeout || me.timeout;
        me.setAnchor(config.el);
        me.anchorAlign = config.align;
        me.setMessage(message);
        

        // If the toast has already been rendered and is visible on the screen
            Ext.util.InputBlocker.blockInputs();
 
            // // if it has not been added to a container, add it to the Viewport.
            // if (!me.getParent() && Ext.Viewport) {
            //     Ext.Viewport.add(me);
            // }
            me.setTimeout(timeout);
            me.startTimer();
            me.show({
                animation: null,
                alignment: {
                    component: config.el,
                    alignment: config.alignment || me.getAlignment(),
                    // options: {
                    //     offset: [0, 20]
                    // }
                }                
            });
    },
 
    /**
     * @private
     */
    beforeHide(animation) {
        this.callParent(arguments);
        // If the message is animating cancel this hide
        // if (this.getIsAnimating()) {
        //     return false;
        // }
 
        this.stopTimer();
 
        // if (!this.next()) {
        //     return false;
        // }
    },
 
    /**
     * @private
     */
    onTimeout() {
        var me = this;
        if (me._timeoutID !== null) {
            let activeToasts = me.getToasts();
            activeToasts.delete(me);
            delete me.anchor;
            me.close();
        }
    },
 
    dodoDestroy() {
        this.stopTimer();
        this.callParent();
    },

    getToasts() {
        var anchor = this.anchor,
            alignment = this.anchorAlign,
            activeToasts = anchor.activeToasts || (anchor.activeToasts = {});
        return activeToasts[alignment] || (activeToasts[alignment] = new Set());
    },

    setAnchor(anchor) {
        let me = this;

        me.anchor = anchor = ((typeof anchor === 'string') ? Ext.getCmp(anchor) : anchor);

    },

}, function(Toast) {
 
    window.Toast = function(message, el, alignment, timeout,fn, scope , args) {
        let toast = null;
            config = {
                message: message,
                timeout: timeout || 3000,
                el: el ||  Ext.Viewport,
                alignment: alignment || 'bl',
                fn: fn,
                scope: scope,
                args: args
            };
        //<debug>
        if (!config) {
            Ext.raise("Toast requires a message");
        }
        //</debug>
 
        if (config.timeout === undefined) {
            config.timeout = Ext.Toast.prototype.config.timeout;
        }

        if (config) {
            toast = Ext.create('Common.ux.Toast'); 
            if (Ext.isFunction(fn)) {
                toast.on('destroy',fn, scope, { single: true, args: args });
            }
            toast.showToast(config);
        }

        return toast;

    };
});

