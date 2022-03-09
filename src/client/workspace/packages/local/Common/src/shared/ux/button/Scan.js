Ext.define('Common.shared.ux.button.Scan',{
    extend: 'Ext.Button',
    xtype: 'uxscanbutton',

    requires:[
        'Common.shared.util.WeChat'        
    ],

    iconCls: 'md-icon-crop-free',
    ui: 'plain',
    disabled: true,

    initialize(){
        let me = this;
        me.callParent();
        if(AppConfig.apiUrl.includes('localhost')) return;
        me.getWxConfig();
    },

    getWxConfig(){
        let me = this;
        //Http.postScriptError("wx", "Scan.getWxConfig", 0, 0 , wx && wx.toString());
        if(wx){
            WeChat.getWeChatConfig()
                .then(me.onGetWeChatConfigSuccess, Ext.bind(Failure.ajax,me,[null, true],true), null, me);
        }
    },

    weChatReady(){
        //console.log('ready')
        let me = this;
        me.on('tap', me.onStartScan, me);
        me.setDisabled(false);
    },

    weChatError(res){
        //console.log('error')
        //console.log('weChatError',res);
        let me = this;
        me.setDisabled(true);
        me.fireEvent('wxerror', me, res);
    },

    onGetWeChatConfigSuccess(response){
        var me = this,
            obj = Http.parseResponseText(response),
            cfg = obj.result;
        if(!cfg) return;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: cfg.appId, // 必填，公众号的唯一标识
            timestamp: cfg.timestamp, // 必填，生成签名的时间戳
            nonceStr: cfg.nonceStr, // 必填，生成签名的随机串
            signature: cfg.signature,// 必填，签名
            jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表
        });  
        wx.ready(Ext.bind(me.weChatReady,me));
        wx.error(Ext.bind(me.weChatError,me));

    },

    onStartScan(){
        let me = this;
        wx.scanQRCode({   
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                //console.log(res);
                let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                //console.log(res);
                if(!Ext.isEmpty(result)){
                    me.fireEvent('scanned', me, res.resultStr);
                    return;
                }
                //var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                //sessionStorage.setItem('saomiao_result',result);
                //其它网页调用二维码扫描结果： 
                //var result=sessionStorage.getItem('saomiao_result');
            }
        });        
    }

})