Ext.define('Phone.view.identity.users.DetailController', {
    extend: 'Common.ux.app.DetailInMoreController',
    alias: 'controller.phone-userdetailcontroller',

    afterUpdateItemText(record , name ,field, value){
        name === 'lockoutEnd' && record.set('text', Format.dateTimeToCheckbox(value, name));
    },

    editView: 'useroneinput',


});