Ext.define('Common.overrides.dom.Element', {
    override: 'Ext.dom.Element',

    // constructor: function(dom) {
    //     var me = this,
    //         id;

    //     if (typeof dom === 'string') {
    //         dom = DOC.getElementById(dom);
    //     }

    //     if (!dom) {
    //         //<debug>
    //         Ext.raise("Invalid domNode reference or an id of an existing domNode: " + dom);
    //         //</debug>

    //         return null;
    //     }

    //     //<debug>
    //     if (Ext.cache[dom.id]) {
    //         Ext.raise("Element cache already contains an entry for id '" +
    //             dom.id + "'.  Use Ext.get() to create or retrieve Element instances.");
    //     }
    //     //</debug>

    //     /**
    //      * The DOM element
    //      * @property dom
    //      * @type HTMLElement
    //      */
    //     me.dom = dom;

    //     if (!(id = dom.id)) {
    //         dom.id = id = me.generateAutoId();
    //     }

    //     if(typeof id === 'object') id = id.id;

    //     me.id = id;

    //     // Uncomment this when debugging orphaned Elements
    //     // if (id === 'ext-element-5') debugger;

    //     //<debug>
    //     if (!me.validIdRe.test(me.id)) {
    //         Ext.raise('Invalid Element "id": "' + me.id + '"');
    //     }
    //     //</debug>

    //     // set an "el" property that references "this".  This allows
    //     // Ext.util.Positionable methods to operate on this.el.dom since it
    //     // gets mixed into both Element and Component
    //     me.el = me;

    //     Ext.cache[id] = me;

    //     me.longpressListenerCount = 0;

    //     me.mixins.observable.constructor.call(me);
    // },

    // inheritableStatics:{
    //     get: function(el) {
    //         var me = this,
    //             cache = Ext.cache,
    //             nodeType, dom, id, entry, isDoc, isWin, isValidNodeType;

    //         if (!el) {
    //             return null;
    //         }

    //         //<debug>
    //         function warnDuplicate(id) {
    //             console.log(Ext.clone(Ext.cache));
    //             Ext.raise("DOM element with id " + id +
    //                 " in Element cache is not the same as element in the DOM. " +
    //                 "Make sure to clean up Element instances using doDestroy()");
    //         }
    //         //</debug>

    //         // Ext.get(flyweight) must return an Element instance, not the flyweight
    //         if (el.isFly) {
    //             el = el.dom;
    //         }

    //         if (typeof el === 'string') {
    //             id = el;

    //             if (cache.hasOwnProperty(id)) {
    //                 entry = cache[id];

    //                 if (entry.skipGarbageCollection || !Ext.isGarbage(entry.dom)) {
    //                     //<debug>
    //                     // eslint-disable-next-line max-len
    //                     dom = Ext.getElementById ? Ext.getElementById(id) : DOC.getElementById(id);

    //                     if (dom && (dom !== entry.dom)) {
    //                         warnDuplicate(id);
    //                     }
    //                     //</debug>

    //                     return entry;
    //                 }
    //                 else {
    //                     entry.doDestroy();
    //                 }
    //             }

    //             if (id === windowId) {
    //                 return Element.get(WIN);
    //             }
    //             else if (id === documentId) {
    //                 return Element.get(DOC);
    //             }

    //             // using Ext.getElementById() allows us to check the detached
    //             // body in addition to the body (Ext JS only).
    //             dom = Ext.getElementById ? Ext.getElementById(id) : DOC.getElementById(id);

    //             if (dom) {
    //                 return new Element(dom);
    //             }
    //         }

    //         nodeType = el.nodeType;

    //         if (nodeType) {
    //             isDoc = (nodeType === 9);
    //             isValidNodeType = me.validNodeTypes[nodeType];
    //         }
    //         else {
    //             // if an object has a window property that refers to itself we can
    //             // reasonably assume that it is a window object.
    //             // have to use == instead of === for IE8
    //             isWin = (el.window == el); // eslint-disable-line eqeqeq
    //         }

    //         // check if we have a valid node type or if the el is a window object before
    //         // proceeding. This allows elements, document fragments, and document/window
    //         // objects (even those inside iframes) to be wrapped.
    //         if (isValidNodeType || isWin) {
    //             id = el.id;

    //             if (el === DOC) {
    //                 el.id = id = documentId;
    //             }
    //             // Must use == here, otherwise IE fails to recognize the window
    //             else if (el == WIN) { // eslint-disable-line eqeqeq
    //                 el.id = id = windowId;
    //             }

    //             if (cache.hasOwnProperty(id)) {
    //                 entry = cache[id];

    //                 // eslint-disable-next-line max-len
    //                 if (entry.skipGarbageCollection || el === entry.dom || !Ext.isGarbage(entry.dom)) {
    //                     //<debug>
    //                     if (el !== entry.dom) {
    //                         warnDuplicate(id);
    //                     }
    //                     //</debug>

    //                     return entry;
    //                 }
    //                 else {
    //                     entry.doDestroy();
    //                 }
    //             }

    //             el = new Element(el);

    //             if (isWin || isDoc) {
    //                 // document and window objects can never be garbage
    //                 el.skipGarbageCollection = true;
    //             }

    //             return el;
    //         }

    //         if (el.isElement) {
    //             return el;
    //         }

    //         if (el.isComposite) {
    //             return el;
    //         }

    //         // Test for iterable. Allow the resulting Composite to be based upon an Array
    //         // or HtmlCollection of nodes.
    //         if (Ext.isIterable(el)) {
    //             return me.select(el);
    //         }

    //         return null;
    //     },

    // }
});
