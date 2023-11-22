Ext.define('Common.oidc.CheckSessionIFrame',{
    alias: 'oidc.checksessioniframe',


    // constructor(config){
    //     let me = this,
    //         parsedUrl = new URL(config.url),
    //         frame;
    //     me.callback = config.callback;
    //     me.clientId = config.clientId;
    //     me.url = config.url;
    //     me.intervalInSeconds = config.intervalInSeconds;
    //     me.stopOnError = config.stopOnError;
    //     me.frameOrigin = parsedUrl.origin;
    //     frame = me.frame = window.document.createElement('iframe');
    //     frame.style.visibility = 'hidden';
    //     frame.style.position = 'fixed';
    //     frame.style.left = '-1000px';
    //     frame.style.top = '0';
    //     frame.width = '0';
    //     frame.height = '0';
    //     frame.src = parsedUrl.href;
    // },

    // load(){
    //     let me = this,
    //         deferrd = new Ext.Deferred();
    //     me.frame.onload = ()=>{
    //         deferrd.resolve();
    //     }
    //     window.document.body.appendChild(me.frame);
    //     window.addEventListener('message', me.message.bind(me), false);
    //     return deferrd.promise;
    // },

    // start(sessionState){
    //     let me = this;
    //     if (me.sessionState === sessionState) {
    //         return;
    //     }

    //     me.stop();

    //     me.sessionState = sessionState;

    //     let send = () => {
    //         if (!me.frame.contentWindow || !me.sessionState) {
    //             return;
    //         }

    //         me.frame.contentWindow.postMessage(me.clientId + " " + me.sessionState, me.frameOrigin);
    //     };

    //     // trigger now
    //     send();

    //     // and setup timer
    //     me.timer = setInterval(send, me.intervalInSeconds * 1000);
    // },

    // stop() {
    //     let me = this;
    //     me.sessionState = null;

    //     if (me.timer) {

    //         clearInterval(me.timer);
    //         me.timer = null;
    //     }
    // },

    // destroy() {
    //     this.destroyMembers('callback', 'frame', 'timer');
    //     this.callParent();
    // },

    // privates:{
    //     message(e){
    //         let me = this,
    //             frameOrigin = me.frameOrigin,
    //             frame = me.frame;
    //         if (e.origin === frameOrigin &&
    //             e.source === frame.contentWindow
    //         ) {
    //             if (e.data === "error") {
    //                 Logger.error(me, "error message from check session op iframe");
    //                 if (me.stopOnError) {
    //                     me.stop();
    //                 }
    //             }
    //             else if (e.data === "changed") {
    //                 Logger.debug(me, "changed message from check session op iframe");
    //                 me.stop();
    //                 me.callback();
    //             }
    //             else {
    //                 Logger.debug(me, e.data + " message from check session op iframe");
    //             }
    //         }
    
    //     }
    // }

});
