Ext.define('Common.overrides.shared.dom.Element', {
    override: 'Ext.dom.Element',

    constructor: function(dom) {
        var me = this,
            id;

        if (typeof dom === 'string') {
            dom = DOC.getElementById(dom);
        }

        if (!dom) {
            //<debug>
            Ext.raise("Invalid domNode reference or an id of an existing domNode: " + dom);
            //</debug>

            return null;
        }

        //<debug>
        if (Ext.cache[dom.id]) {
            Ext.raise("Element cache already contains an entry for id '" +
                dom.id + "'.  Use Ext.get() to create or retrieve Element instances.");
        }
        //</debug>

        /**
         * The DOM element
         * @property dom
         * @type HTMLElement
         */
        me.dom = dom;

        if (!(id = dom.id)) {
            dom.id = id = me.generateAutoId();
        }

        if(typeof id === 'object') id = id.id;

        me.id = id;

        // Uncomment this when debugging orphaned Elements
        // if (id === 'ext-element-5') debugger;

        //<debug>
        if (!me.validIdRe.test(me.id)) {
            Ext.raise('Invalid Element "id": "' + me.id + '"');
        }
        //</debug>

        // set an "el" property that references "this".  This allows
        // Ext.util.Positionable methods to operate on this.el.dom since it
        // gets mixed into both Element and Component
        me.el = me;

        Ext.cache[id] = me;

        me.longpressListenerCount = 0;

        me.mixins.observable.constructor.call(me);
    },
});
