Ext.define('Common.shared.view.BasePage', {
    extend: 'Ext.Panel',
    
    requires: [
        'Common.shared.ux.button.Language'
    ],

    config:{
        bottomMessage: `<div class="{6}">
            Copyright © {0}{1} 
            <a class="white" href="{2}" target="_blank">{3}</a> {4}
            <a class="grey-700" href="http://www.miitbeian.gov.cn/" target="_blank" >{5}</a>
            </div>
        `,
        bottomBar:{
            xtype: 'container',
            docked: 'bottom',
            itemId: 'bottomBar',
            height: 60,
            userCls: 'bg-dark text-center grey-700 p-2'
        },
    
    },

    header:{
        items:[
            {
                xtype: 'languagebutton',
                docked: 'right'
            }
        ]
    },

    // responsiveConfig:{
    //     desktop:{
    //         },
    //     phone:{
    //         tbar:{
    //             //userCls:'bg-base-color',
    //             layout: {
    //                 type: 'box',
    //                 vertical: false,
    //                 pack: 'center'
    //             },
    //             items:[
    //                 // {
    //                 //     xtype: 'languagebutton',
    //                 // },
    //                 {
    //                     xtype: 'button',
    //                     //ui: 'default',
    //                     text: 'abc',
    //                     menu:{
    //                         items: [
    //                         {
                                
    //                             text: 'a'
    //                         }
    //                         ]
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // },


    //fullscreen: true,
    isGlobalView: true,
    responsiveConfig:{
        desktop:{
            titleAlign: 'center',
        },
        phone:{
            header:{
                title:{
                    margin: 'auto 0 auto 10px'
                }
            },
        }
    },

    layout:{
        type:'vbox',
        pack:'center',
        align:'center'
    },        


    applyBottomBar (newCmp, oldCmp) {
        return Ext.updateWidget(oldCmp, newCmp, this, 'createBottomBar');
    },

    updateBottomBar (cmp) {
        if (cmp) {
            this.add(cmp);
        }
    },

    createBottomBar(config) {
        const me = this;
        return Ext.apply({}, config);
    },
    
    onLocalized(){
        const me = this,
            bar = me.down('#bottomBar'),
            currentYear = new Date().getFullYear(),
            startYear = parseInt(I18N.get('CopyrightStartValue')),
            desktop = Ext.platformTags.desktop;
        me.callParent();
        if(!bar) return;
        bar.setHtml(Ext.String.format(me.getBottomMessage(), 
            currentYear == startYear ? '' : startYear + '-',
            currentYear,
            I18N.get('CompanyUrl'),
            I18N.get('CompanyFullName'),
            desktop ? '' : '<br/>',
            I18N.get('Icp'),
            desktop ? 'lh-50': 'lh-24'
         ))

    }

});
