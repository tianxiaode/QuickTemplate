Ext.define('Common.core.util.crypo.Base', {


    privates: {



        safeAdd(x, y) {
            let lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

    }
})