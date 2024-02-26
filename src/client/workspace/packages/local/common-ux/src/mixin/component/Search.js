Ext.define('Common.mixin.component.Search', {
    extend: 'Common.mixin.Component',

    config: {
        searchButton: {}
    },


    createSearchButton(config) {
        return Ext.apply({
            xtype: 'button',
            iconCls: 'md-icon-search',
            ui: 'plain',
            ownerCmp: this,
            handler: this.onSwitchSearchPanel
        }, config);
    },

    applySearchButton(config, old) {
        return Ext.updateWidget(old, config,this, 'createSearchButton');
    },

    updateSearchButton(config){
        config && this.add(config);
    },

    onSwitchSearchPanel(){
        let panel = this.down('[isSearchPanel]');
        if(!panel) Ext.raise('No search panel');
        let hidden =  panel.getHidden();
        panel.setHidden(!hidden);
    },

    doDestroy() {
        this.destroyMembers('searchButton');
    }



})
