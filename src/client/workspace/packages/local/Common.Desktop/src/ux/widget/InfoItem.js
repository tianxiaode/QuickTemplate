/**
 * 信息item
 */
Ext.define("Common.Desktop.ux.widget.InfoItem",{
    extend: 'Ext.Component',
    xtype:"uxinfoitem",

    config: {
        label: null,
        labelStyle: null,
    },

    baseCls: Ext.baseCSSPrefix + 'info-item',
    mixins: ['Ext.mixin.Toolable'],
    //style: 'display:inline-block',
    template: [
        {
            reference: 'bodyElement',
            cls: Ext.baseCSSPrefix + 'info-item-body-el',
            uiCls: 'body-el',
            children:[
                {
                    reference: "labelElement",
                    cls: Ext.baseCSSPrefix + 'label',
                },
                {
                    reference: 'labelSeparator',
                    cls: Ext.baseCSSPrefix + 'separator',
                },
                {
                    cls: Ext.baseCSSPrefix + 'info',
                    reference: 'innerElement',
                },
                {
                    cls: Ext.baseCSSPrefix + 'tool-dock',
                    children:[
                        {
                            reference: 'toolBody',
                        }
                    ]
                }
            ]
        }
    ],
    disabled: true,
    toolAnchorName: 'toolBody',
    toolDefaults:{
        xtype: 'tool',
        zone: 'start'        
    },


    updateLabel: function (text){
        if(!Ext.isEmpty(text)){
            let me = this;
            me.labelElement.update(text);
            me.labelSeparator.update(I18N.LabelSeparator);
        }
        return text;
    },

    updateLabelStyle: function (style) {
        if(Ext.isObject(style))
            this.labelElement.setStyle(style);
    },


    privates: {
        getRenderTarget: function () {
            return this.innerElement;
        },

    },

});