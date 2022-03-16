Ext.define('Common.view.BasePage', {
    extend: 'Ext.Panel',
    xtype: 'basepage',
    
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
            xtype: 'container',
            docked: 'bottom',
            itemId: 'bottomBar',
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


    applyBottomBar (newCmp, oldCmp) {
        return Ext.updateWidget(oldCmp, newCmp, this, 'createBottomBar');
    },

    updateBottomBar (cmp) {
        if (cmp) {
            this.add(cmp);
        }
    },

    createBottomBar(config) {
        let me = this;
        return Ext.apply({}, config);
    },
    
    onLocalized(){
        let me = this,
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

    },


});
