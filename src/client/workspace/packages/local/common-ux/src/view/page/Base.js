Ext.define('Common.view.page.Base', {
    extend: 'Ext.Panel',
    alias: 'page.base',
    
    requires: [
        'Common.core.service.Config',
        'Common.setting.Setting',
        'Ext.Responsive'
    ],

    config:{
        bottomMessage: `<div class="{6}">
            Copyright © {0}{1} 
            <a class="text-light" href="{2}" target="_blank">{3}</a> {4}
            <a class="text-light" href="http://www.miitbeian.gov.cn/" target="_blank" >{5}</a>
            </div>
        `,
        bottomBar:{
            xtype: 'component',
            docked: 'bottom',
            height: 60,
            userCls: 'bg-dark text-center text-light p-2'
        },
    
    },


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

    createBottomBar(config) {
        return Ext.apply({}, config);
    },

    applyBottomBar (config, old) {
        return Ext.updateWidget(old, config, this, 'createBottomBar');
    },

    updateBottomBar (config) {
        config && this.add(config);
    },

    initialize(){
        let me = this,
            bar = me.getBottomBar(),
            currentYear = new Date().getFullYear(),
            startYear = AppSetting['copyrightStartValue'],
            isDesktop = Ext.platformTags.desktop,
            lang = Config.getCurrentLanguage();
        me.callParent();
        me.setTitle(AppSetting['companyShortName'][lang]);
        bar.setHtml(Ext.String.format(me.getBottomMessage(), 
            currentYear == startYear ? '' : startYear + '-',
            currentYear,
            AppSetting['companyUrl'],
            AppSetting['companyFullName'][lang],
            isDesktop ? '' : '<br/>',
            AppSetting['icp'],
            isDesktop ? 'lh-50': 'lh-24'
         ))

    },

    doDestroy(){
        let me = this;
        me.setBottomMessage(null);
        me.setBottomBar(null);
        this.callParent();
    }

});
