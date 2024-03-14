Ext.define('Common.overrides.grid.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',

    config: {
        autoText: false,
        langText: '#',
        text: '#'
        //width: 60
    },

    privates: {

        doCheckWidth() {
            var me = this,
                store = me.getGrid().getStore(),
                charLen = 1,
                charWidth = me.getCharWidth();

            if (store && store.getTotalCount()) {
                // Ensure we measure the *formatted* length of the largest row number
                charLen = me.getScratchCell().printValue(store.getTotalCount()).length;
            }

            Logger.debug(this.doCheckWidth, charWidth, charLen, Math.ceil(charLen * charWidth), store && store.getTotalCount());

            me.textElement.setStyle('min-width', Math.ceil(charLen * charWidth) + 'px');
        }

    }


});