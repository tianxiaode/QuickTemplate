Ext.define('Common.overrides.grid.Grid', {
    override: 'Ext.grid.Grid',
    
    getSelectedRecord(){
        return this.getSelectable().getSelectedRecord();
    },

    getSelectedRecords(){
        return this.getSelectable().getSelectedRecords();
    }

});