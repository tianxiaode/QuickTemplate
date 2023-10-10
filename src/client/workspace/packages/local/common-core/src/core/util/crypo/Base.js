Ext.define('Common.core.util.crypo.Base', {

    blockSize: 512 / 32,
    minBufferSize: 0,

    get(string, isUpper) {
        let me = this;
        me.hash = me.H.slice(0);
        return this.doFinalize(string,isUpper);
    },

    privates: {

        /*
        * Convert a raw string to an array of big-endian words
        * Characters >255 have their high-byte silently ignored.
        */
        parse(hexStr) {
            let data = [],
                ln = hexStr.length;

            for (let i = 0; i < ln; i += 2) {
                data[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }
            return data;
        },



        process(data) {

            for (i = 0; i < data.length; i += 16){
                this.doProcessBlock(data, i);
            }

        },


        safeAdd(x, y) {
            let lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        },

        stringify(data) {
            let latin1Chars = [];
            for (let i = 0; i < data.length; i++) {
                let bite = (data[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }
            return latin1Chars.join('');

        },

        /*
        * Convert a raw string to an array of big-endian words
        * Characters >255 have their high-byte silently ignored.
        */
        getBytes(input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            return output;
        },

        /*
         * Convert an array of big-endian words to a string
         */
        bytesToUtf8(input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
            return output;
        },
        /*
        * Convert a raw string to a hex string
        */
        toHexString(input, isUpper) {
            let hexTab = isUpper ? "0123456789ABCDEF" : "0123456789abcdef",
                output = '',
                x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hexTab.charAt((x >>> 4) & 0x0F)
                    + hexTab.charAt(x & 0x0F);
            }
            return output;
        },


        doProcessBlock() { },
        doFinalize(){}


    }
})