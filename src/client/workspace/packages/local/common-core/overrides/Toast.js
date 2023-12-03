Ext.define('Common.overrides.Toast',{
    override: 'Ext.Toast',    

    config:{
        timeout: 3000,
        maxQueue: 10,
        enter: 'top',
        exit: 'top'
    },

    bodyStyle:{
        'min-width': '300px',
    },

    showToast(config) {
        var me = this,
            message = config.message,
            timeout = config.timeout || this.getTimeout(),
            messageContainer = me.getMessage(),
            msgAnimation = me.getMessageAnimation();

        // If the toast has already been rendered and is visible on the screen
        if (me.isRendered() && me.isHidden() === false) {
            messageContainer.onAfter({
                // After the hide is complete
                hiddenchange: function() {
                    me.setMessage(message);
                    me.setTimeout(timeout);
                    if(config.bodyCls){
                        me.setBodyCls(config.bodyCls);
                    }
                    messageContainer.onAfter({
                        scope: me,
                        // After the show is complete
                        hiddenchange: function() {
                            me.startTimer();
                        },
                        single: true
                    });
                    messageContainer.show(msgAnimation);
                },
                scope: me,
                single: true
            });

            messageContainer.hide(msgAnimation);
        }
        else {
            Ext.util.InputBlocker.blockInputs();

            // if it has not been added to a container, add it to the Viewport.
            if (!me.getParent() && Ext.Viewport) {
                Ext.Viewport.add(me);
            }

            me.setMessage(message);
            me.setTimeout(timeout);
            if(config.bodyCls){
                me.setBodyCls(config.bodyCls);
            }
            me.startTimer();
            me.show({
                animation: null,
                alignment: {
                    component: document.body,
                    alignment: config.alignment || 't-t',
                    options: {
                        offset: [0, 20]
                    }
                }
            });
        }
    }


});
