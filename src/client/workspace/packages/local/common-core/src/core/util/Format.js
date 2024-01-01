Ext.define('Common.core.util.Format', {

    constructor() {
        Object.assign(Ext.util.Format, this.fn);
    },

    fn: {
        LF: '&#10;',
        emptyString: '\xA0',
        checkCls: 'x-checked',
        defaultPermissions: ['Create', 'Update', 'Delete'],
        getEpochTime() {
            return Math.floor(Ext.now() / 1000);
        },
        splitCamelCase(str, replace) {
            if (Ext.isEmpty(str)) return '';
            replace = replace || '-';
            return str.replace(/::/g, replace)
                .replace(/([A-Z]+)([A-Z][a-z])/g, `$1${replace}$2`)
                .replace(/([a-z\d])([A-Z])/g, `$1${replace}$2`)
                .toLowerCase();
        },
        toCamelCase(str, split){
            if (Ext.isEmpty(str)) return '';
            let words = str.split(split),
                result = '';
            Ext.each(words, (w)=>{
                if(Ext.isEmpty(result)){
                    result = w;
                }else{
                    result += Ext.String.capitalize(w);
                }
            })
            return result;
        },
    },

    destroy() {
        this.destroyMembers('fn');
        this.callParent();
    }


}, function () {
    Ext.create('Common.core.util.Format');
    window.Format = Ext.util.Format;
});