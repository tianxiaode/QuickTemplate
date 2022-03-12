Ext.define('Common.ux.Img',{
    extend: 'Ext.Img',
    xtype: 'uximage',

    mixins:[
        'Common.mixin.ImageLoad',
    ],

    defaultBindProperty: 'url',
    
    useTooltip: false,
    useAjax: false,
    useHolder: true,



})