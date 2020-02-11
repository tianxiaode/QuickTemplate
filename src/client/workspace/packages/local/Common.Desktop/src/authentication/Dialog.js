/**
 * This is the base class for all Authentication related Form dialogs. It optionally
 * enables autoComplete support to any child textfield so that browsers or their plugins
 * may restore/persist username, password and other attributes to/from such forms.
 */
Ext.define('Common.Desktop.authentication.Dialog', {
    extend: 'Ext.form.Panel',
    xtype: 'authdialog',

    requires: [
        'Common.Desktop.authentication.AuthenticationController',
    ],

    //controller: 'authentication',

    bodyStyle: 'background:#fff',
    baseCls: 'auth-dialog',


    /*
     * Seek out the first enabled, focusable, empty textfield when the form is focused
     */
    defaultFocus: 'textfield[focusable]:not([hidden]):not([disabled]):not([value])',
    activeItem: 'textfield[focusable]:not([hidden]):not([disabled]):not([value])'

});
