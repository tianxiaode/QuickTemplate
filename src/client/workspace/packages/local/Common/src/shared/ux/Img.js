Ext.define('Common.shared.ux.Img',{
    extend: 'Ext.Img',
    xtype: 'uximage',

    mixins:[
        'Common.shared.mixin.ImageLoad',
    ],

    defaultBindProperty: 'url',
    
    useTooltip: false,
    useAjax: false,
    useHolder: true,



})