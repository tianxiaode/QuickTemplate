Ext.define('Common.shared.util.TemplateFn',{
    singleton: true,
    
    requires:[
        'Ext.util.Format'
    ],

    constructor(){
        Object.assign(Ext.util.Format, this.fn);
    },

    fn:{
        ledgerGroup(v){
            return v>0 ? '' : 'red';
        },
        color(v){
            return v ? 'green' : 'red';
        },
        isOnline(v,values){
            return v ? 'md-icon-signal-cellular-4-bar green' : 'md-icon-signal-cellular-connected-no-internet-4-bar red';
        },
        image(v){
            if(Ext.isEmpty(v)) return URI.getResource('holder');
            return (v.includes('http') ? '' : ROOTPATH) + v;
        },
        time(v){
            return Ext.Date.format(v,I18N.DefaultDatetimeFormat);
        },
        paymentMethods(v){
            let emptyStr = `${I18N.NoDefine}${I18N.Model.DeviceInfo.paymentMethods}`;
            if(!Ext.isArray(v)) return emptyStr;
            let keys = Object.keys(Enums.PaymentMethod),
                ret = [];
            v.forEach(element => {
                var find = keys.find(key=>key.toLowerCase() === element.toLowerCase());
                ret.push(find ? Enums.PaymentMethod[find].text : element);
            });
            return ret.length >0 ? ret.join(',') : emptyStr;
        },
        paymentMethodsColor(v){
            return Ext.isEmpty(v) ? 'red' : '';
        },
        lockState(v){
            let disabled = v !== 0 ? 'disabled' : '',
                color = v === 0 ? 'btn-success' : v ===1 ? 'btn-warning' : 'btn-danger',
                icon =  v === 2? 'x-fa fa-unlock-alt' : 'x-fa fa-lock';
            return `${disabled} ${color} ${icon}`;
        },
        convertBoolean(v){
            return v ? I18N.True : I18N.False;
        },
        ledgerAmount(v,values, fieldName){            
            let type = values[fieldName];
            return type === Enums.LedgerType.Cash.value ? 
                v : `${v}%`;    
        },
        discount(v,values){
            return values.discountType === Enums.LedgerType.Percent.value ? 
                `${v}%` :FM.currency(v);
        },
        boolValueRenderer(v){
            return `<span class="x-fa fa-${v ? 'check' : 'times'} ${v ? 'green' : 'red'}"></span>`        
        },        
        payMethod(v){
            if(Ext.isEmpty(v)) return v;
            let  keys = Object.keys(Enums.PaymentMethod),
                find = keys.find(key=>key.toLowerCase() === v.toLowerCase());
            return find ? Enums.PaymentMethod[find].text : v;
        },
        promoCode(v,values){
            if(Ext.isEmpty(v)) return I18N.None + I18N.Model.Order.promoCode;
            let discount  = values.discount,
                discountStr = values.discountType === 1 ? Ext.util.Format.currency(discount) 
                : `${discount}%`;
            return  `${v},${discountStr}`;
        },
        orderSn(v,values){
            return `${v}(${values.ageLimit}${I18N.YearOld})`;
        },
        payStatusColor(v){
            return (v === Enums.PayStatus.Success.value
                || v === Enums.PayStatus.ManualRefundSuccess.value
                || v === Enums.PayStatus.AutoRefundSuccess.value)
                ? 'text-success' :
                (v === Enums.PayStatus.Pending.value
                    || v === Enums.PayStatus.ManualRefundPending.value
                    || v === Enums.PayStatus.AutoRefundPending.value )
                ? 'text-warning' :
                (v === Enums.PayStatus.AutoRefundFailed.value
                    || v === Enums.PayStatus.ManualRefundFailed.value )
                ? 'text-danger' : '';
        
        },
        shipmentStatusColor(v){
            return v === Enums.ShipmentStatus.Success.value
                ? 'text-success' :
                v === Enums.ShipmentStatus.Pending.value
                ? 'text-warning' :
                v === Enums.ShipmentStatus.Failed.value
                ? 'text-danger' : '';
        },
        cash(v,values){
            if(Ext.isEmpty(v)) return '';
            return v.toLowerCase() === Enums.PaymentMethod.Cash.key.toLowerCase()
                ? `(${Ext.util.Format.currency(values.slotAmount)},${Ext.util.Format.currency(values.changeAmount)})`
                : ''
        },
        getEnumValue(v, name){            
            return Enums.getEnumText(v,name,I18N.None);
        },
        content: function(v){
            if(Ext.isEmpty(v)) return I18N.None;
            return Ext.String.htmlEncode(v).replace(/\n/g, '<br>');
        }, 
        hidden(v){
            return v ? '' : 'x-hidden';
        },   
        inventory(v){
            return v===0 ? "orange" : "";
        },
        expireTime(v){
            return Ext.isEmpty(v) ? I18N.None : Ext.Date.format(v,I18N.DefaultDatetimeFormat);
        },
        highlight(value){
            let store =this.scope.getStore(),
                params = store.getProxy().extraParams,
                query = params.query === I18N.None ? '' : params.query;
            return Ext.isEmpty(query) || Ext.isEmpty(value) ? value : value.replace(new RegExp('(' + query + ')', "gi"), '<span style="color:red;">$1</span>');
        },
        isConfirm(v,values){
            if(values.userId === CFG.user.id && !v){
                return `<button type="button" data-value="${values.id}"  class="btn btn-success btn-sm">${I18N.Confirm}</button>`
            }
            return FM.boolValueRenderer(v);
        },
        payee(v,values){
            if(values.payeeId === 0) return I18N.Buyer;
            return v;
        },
        receiver(v,values){     
            if(Ext.isEmpty(values)) return v;
            if(values.receiverId === 0) return I18N.Buyer;
            if(values.payeeId === values.receiverId) return v;
            let amount = values.ledgerType === Enums.LedgerType.Cash.value ? 
                    Ext.util.Format.currency(values.amountOfLedger) : 
                    values.ledgerType === Enums.LedgerType.Percent.value ?
                    `${values.amountOfLedger}%` : '100%';
            return `${v}(${amount})`;
        },
        salesCodeDisplay: function(v){
            return v === Enums.UserType.MarketingStaff.value || v===Enums.UserType.Lessee.value ? '' : 'd-none';
        },
        discountDisplay(v){
            return v === Enums.UserType.MarketingStaff.value ? '' : 'd-none';
        },    
        idText(value){
            return value >0 ? value : '';
        },
        checkIcon(v){
            return v ? 'x-fa fa-check-square' : 'x-far fa-square';
        },
        display(v){
            return v ? '' : 'd-none';
        },
        message: function(v){
            if(Ext.isEmpty(v)) return I18N.None;
            v = Ext.String.htmlEncode(v).replace(/\n+/g, '\n');
            return '<p class="text-indent m-0 p-0 lh-20">' + v.replace(/\n/g, '</p><p class="text-indent m-0 p-0 lh-20">') + '</p>';
        },
        amountReceived(v,values){
            let isIncome = values.receiverId === CFG.user.id,
                calValue = isIncome ? v : v * -1;
            amount = FM.currency(calValue);
            return amount;
        },
        amountReceivedExport(v,values){
            let isIncome = values.receiverId === CFG.user.id,
                calValue = isIncome ? v : v * -1;
            return calValue;
        },
        receiverId(v){
            return v === CFG.user.id ? 'green' : 'red';
        },
        deviceLineTitle(value){
            let v = parseInt(value);
            return String.fromCharCode(v+65) + I18N.LineTitle;
        },
        notificationName(v, values){
            return v === 'SystemNotification' || 
                    v === 'noConfirmLedger' || 
                    (v === 'WeChatApplymentResult' && values.entityId>0) ||
                    (v === 'WeChatApplymentUpgradeResult' && values.entityId>0) ? '' : 'x-hidden-display';
        },
        notificationState(v){
            return v === 0 ? 'base-color' : 'black';
        },
        notificationIsRead(v){
            return v === 0 ? 'grey' : 'base-color';
        },
        deleteNotification(v){
            return v === 'noCertification' || v === 'noConfirmLedger' ? 'x-hidden-display' : '';
        },
        notificationButtonPadding(v){
            return Ext.getApplication().getName() === 'Phone' ? 'pr-4' : 'pr-1';
        },
        backLogEntityId(v){
            if(Ext.isEmpty(v)) return '';
            if(v <= 0) return '';
            return '<span class="x-fa fa-bars entity pl-4"></span>'
        },
        changeBalanceColor(v,values){
            if(!values.hasChangeBox) return '';
            return v < 10  ? 'text-danger' : v < 50 ? 'text-warning' : '';
        },
        changeBalance(v,values){
            if(!values.hasChangeBox) return I18N.None;
            return FM.currency(v);
        },
        changeCount(v, values){
            if(!values.hasChangeBox) return I18N.None;
            return v;
        },
        lineCountColor(v){
            return v > 0  ? 'text-danger' : '';
        },
        goodsContainerCount(v){
            let str = v.toString(2);
            return str.replace(/0/g,'').length;    
        },
        emptyRateColor(v){
            return v < 0.3 ? 'text-danger' : v < 0.7 ? 'text-warning' : '';
        },
    }
});