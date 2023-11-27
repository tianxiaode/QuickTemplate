Ext.define('Common.view.page.Base', {
    extend: 'Ext.Panel',
    alias: 'page.base',
    
    requires: [
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

    onLocalized(){
        let me = this,
            bar = me.getBottomBar(),
            currentYear = new Date().getFullYear(),
            startYear = parseInt(I18N.get('CopyrightStartValue')),
            isDesktop = Ext.platformTags.desktop;
        me.callParent();
        console.log(bar)
        if(!bar) return;
        bar.update(Ext.String.format(me.getBottomMessage(), 
            currentYear == startYear ? '' : startYear + '-',
            currentYear,
            I18N.get('CompanyUrl') || '快速模板',
            I18N.get('CompanyFullName') || '快速模板',
            isDesktop ? '' : '<br/>',
            I18N.get('Icp') || 'ICP1000000-0000',
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
