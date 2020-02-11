/**
 * This class provides the modal Ext.Window support for all Authentication forms.
 * It's layout is structured to center any Authentication dialog within it's center,
 * and provides a backGround image during such operations.
 */
Ext.define('Common.Desktop.authentication.LockingWindow', {
    extend: 'Ext.Panel',
    xtype: 'lockingwindow',

    zIndex: 800,
    fullscreen: true,
    modal: true,
    float: true,
    closeAction: 'hide',
    hideMode: 'display',
    
    baseCls: 'auth-locked',
    titleAlign: 'center',
    maximized: true,
    modal: true,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    //controller: 'authentication',

    bbar: {
        align: 'center',
        style: 'background:#353535;color:#6666',
        items:[
            {
                xtype: 'component',
                flex:1,
                userCls: 'text-center',
                html: `@${I18N.CopyrightStartValue} ${(new Date()).getFullYear()} <a style="color:#fff;" class="link-forgot-password grey text-decoration-none pl-1" href="${I18N.CompanyWebsite}" target="_blank">${I18N.CompanyFullName}</a>                
                    <a class="link-forgot-password grey text-decoration-none pl-4" href="http://www.miitbeian.gov.cn/" target="_blank"  style="color:#666;">${I18N.ICP}</a>`        
            }
        ]
    
    }
});
