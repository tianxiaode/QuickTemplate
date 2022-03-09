Ext.define('Common.shared.ux.Logo', {
    extend: 'Ext.Component',
    xtype: 'uxlogo',

    requires:[
        'Common.shared.view.logos.LogoEdit',
    ],

    userCls:'logo',


    logoHtml:`
        <img class="logo-img {1}" src="{0}"></span>
        <span  class="company-name text-truncate" >{2}</span>
    `,
    
    initialize(){
        let me = this;
        if(I18N.isReady || Config.isReady) me.initLogo();
        Config.on('ready', me.initLogo, me);
        Ext.on('i18nready', me.initLogo, me);
        me.callParent();
    },

    initLogo(){
        let me= this,
            allowEdit = me.isAllowEdit();
        if(!I18N.isReady){
            Ext.defer(me.initLogo, 50 , me);
            return;
        }
        me.switchLogo();
        if(!allowEdit) return;
        Ext.on('logochange', me.switchLogo, me);
        me.on('tap', me.onChangeLogo, me,{
            element: 'element',
            delegate: 'img.logo-img'
        });
    },

    onChangeLogo(){
        let me= this,
            allowEdit = me.isAllowEdit();
        if(!allowEdit) return;
        let xtype = 'logoedit';
        ViewMgr.setParams(xtype, {
            type: me.isPhone ? ViewMgr.types.view : ViewMgr.types.dialog,
            config : {
                includeResource: true,
                backView: Ext.History.getToken(),
            },
        });
        Ext.History.add(`${xtype}/edit`);
    },
    
    switchLogo(){
        let me= this,
            allowEdit = me.isAllowEdit(),
            ou = Config.getCurrentOrganizationUnit(),
            logo = ou && ou.logo,
            shortName = ou && ou.shortName,
            logoUrl = me.getLogoUrl(logo),
            html = me.logoHtml;        
        if(Ext.isEmpty(shortName) || shortName.toLowerCase() === 'default') shortName = I18N.get('CompanyShortName')
        me.setHtml(Ext.String.format(html, logoUrl, 
            allowEdit ? 'cursor-pointer' : '',  
            shortName));
    },

    getLogoUrl(logo){
        if(Ext.isEmpty(logo) || logo === 'default' || logo === 'Default') return  URI.getResource('logo');
        return URI.crud('File',logo);
    },

    isAllowEdit(){
        return ACL.isGranted('Pages.User.Create') || false;
    }

});
