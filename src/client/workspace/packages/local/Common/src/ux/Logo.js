Ext.define('Common.ux.Logo', {
    extend: 'Ext.Component',
    xtype: 'uxlogo',

    userCls:'logo',


    logoHtml:`
        <img class="logo-img {1}" src="{0}"></span>
        <span  class="company-name text-truncate" >{2}</span>
    `,
    
    // initialize(){
    //     let me = this;
    //     Config.isReady && me.switchLogo();
    //     Config.on('ready', me.switchLogo, me);
    //     me.callParent();
    // },

    onLocalized(){
        this.callParent();
        this.switchLogo();
    },

    switchLogo(){
        let me= this,
            shortName = I18N.get('CompanyShortName'),
            logoUrl = URI.getResource('logo'),
            html = me.logoHtml;
        me.setHtml(Format.format(html, logoUrl, 
            '',  
            shortName));
    },

    getLogoUrl(logo){
        if(Ext.isEmpty(logo) || logo === 'default' || logo === 'Default') return  URI.getResource('logo');
        return URI.crud('File',logo);
    },


});
