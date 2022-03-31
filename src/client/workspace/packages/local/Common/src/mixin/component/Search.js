Ext.define('Common.mixin.component.Search', {
    extend: 'Common.mixin.component.Base',

    config: {
        searchButton: {
            xtype: 'button',
            iconCls: 'md-icon-search',
            ui: 'plain',
        },
    },

    createSearchButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
            handler: this.onSwitchSearchPanel
        }, newCmp);
    },

    applySearchButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createSearchButton');
    },

    initMixinComponent(me, container){
        container.add(me.getSearchButton());
    },

    onSwitchSearchPanel(){
        let panel = this.down('[isSearchPanel]');
        if(!panel) Ext.raise('No search panel');
        let hidden =  panel.getHidden();
        panel.setHidden(!hidden);
    }


})
