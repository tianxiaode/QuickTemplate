Ext.define('Common.Overrides.shared.field.Checkbox',{
    override: 'Ext.field.Checkbox',

    getSubmitValue: function() {
        var unchecked = this.uncheckedValue,
            uncheckedVal = Ext.isDefined(unchecked) ? unchecked : null;        
        return (this.getChecked()) ? Ext.isEmpty(this._value) ? true : this._value : uncheckedVal;
    },

});