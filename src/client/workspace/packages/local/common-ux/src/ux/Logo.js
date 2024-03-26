Ext.define('Common.ux.Logo', {
    extend: 'Ext.Component',
    xtype: 'uxlogo',

    userCls: 'logo',


    template: [
        {
            reference: 'logoElement',
            cls: 'logo-img',
            tag: 'img',
        },
        {
            reference: 'nameElement',
            tag: 'span',
            cls: 'company-name text-truncate',
        }
    ],

    onLocalized(){
        this.callParent();
        this.switchLogo();        
    },

    switchLogo(){
        let me= this,
            shortName = window.locale.get('companyShortName'),
            logoUrl = URI.getResource('logo'),
            cls = Ext.platformTags.phone ? 'phone' : 'desktop';
        me.setUserCls(`logo ${cls}`);
        me.logoElement.dom.src = logoUrl;
        me.nameElement.dom.innerHTML = shortName;
    },

    getLogoUrl(logo){
        if(Ext.isEmpty(logo) || logo === 'default' || logo === 'Default') return  URI.getResource('logo');
        return URI.crud('File',logo);
    }


});
