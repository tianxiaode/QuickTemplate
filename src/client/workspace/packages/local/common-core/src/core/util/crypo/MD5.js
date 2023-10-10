Ext.define('Common.core.util.crypo.MD5', {
    extend: 'Common.core.util.crypo.Base',
    alternateClassName: 'MD5',
    singleton: true,

    // get(string, isRaw, isUpper) {
    //     let me = this,
    //         bytes = me.getBytes(string),
    //         result = me.process(bytes, string.length * 8);
    //     return isRaw ? me.toRawString(result) : me.toHexString(result, isUpper);
    // },


    privates:{

        // toRawString(input) {
        //     let str = "",
        //         mask = (1 << 8) - 1;
        //     for (var i = 0; i < input.length * 32; i += 8) {
        //         str += String.fromCharCode((input[i >> 5] >>> (i % 32)) & mask);
        //     }
        //     return str;

        // },

        // /*
        // * Convert a raw string to a hex string
        // */
        // toHexString(input, isUpper) {
        //     let hexTab = isUpper ? "0123456789ABCDEF" : "0123456789abcdef",
        //         output = "";
        //     for (var i = 0; i < input.length * 4; i++) {
        //         output += hexTab.charAt((input[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hexTab.charAt((input[i >> 2] >> ((i % 4) * 8)) & 0xF);
        //     }
        //     return output;
        // },

        // /*
        // * Convert a raw string to an array of big-endian words
        // * Characters >255 have their high-byte silently ignored.
        // */
        // getBytes(string) {
        //     let bin = [],
        //         size = 8,
        //         mask = (1 << size) - 1;
        //     for (let i = 0; i < string.length * size; i += size) {
        //         bin[i >> 5] |= (string.charCodeAt(i / size) & mask) << (i % 32);
        //     }
        //     return bin;        
        // },

        // str2binl: function(str, chrsz) {
        //     var bin = [];
        //     var mask = (1 << chrsz) - 1;
        //     for (var i = 0; i < str.length * chrsz; i += chrsz) {
        //         bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        //     }
        //     return bin;
        // },
    

        bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        },
    
        md5_cmn(q, a, b, x, s, t) {
            let me = this;
            return me.safeAdd(me.bit_rol(me.safeAdd(me.safeAdd(a, q), me.safeAdd(x, t)), s), b);
        },
    
        md5_ff(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        },
    
        md5_gg(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        },
    
        md5_hh(a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        },
    
        md5_ii(a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        },
    
        H: [1732584193, -271733879, -1732584194,  271733878],
    
        doProcessBlock(data, offset) {
            let me = this,
                H = me.hash,
                [a, b, c, d] = H,
                DataOffset = [];
   

	            for (var i = 0; i < 16; i++) {
	                // let offset_i = offset + i,
                    //     data_offset_i = data[offset_i];

	                // data[offset_i] = (
	                //     (((data_offset_i << 8)  | (data_offset_i >>> 24)) & 0x00ff00ff) |
	                //     (((data_offset_i << 24) | (data_offset_i >>> 8))  & 0xff00ff00)
	                // );
                    DataOffset[i] = data[offset+0];
	            }


                let md5_ff = me.md5_ff.bind(me),
                    md5_gg = me.md5_gg.bind(me),
                    md5_hh = me.md5_hh.bind(me),
                    md5_ii = me.md5_ii.bind(me),
                    safeAdd = me.safeAdd.bind(me);
                a = md5_ff(a, b, c, d, DataOffset[0], 7, -680876936);
                d = md5_ff(d, a, b, c, DataOffset[1], 12, -389564586);
                c = md5_ff(c, d, a, b, DataOffset[ 2], 17, 606105819);
                b = md5_ff(b, c, d, a, DataOffset[ 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, DataOffset[ 4], 7, -176418897);
                d = md5_ff(d, a, b, c, DataOffset[ 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, DataOffset[ 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, DataOffset[ 7], 22, -45705983);
                a = md5_ff(a, b, c, d, DataOffset[ 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, DataOffset[ 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, DataOffset[ 10], 17, -42063);
                b = md5_ff(b, c, d, a, DataOffset[ 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, DataOffset[ 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, DataOffset[ 13], 12, -40341101);
                c = md5_ff(c, d, a, b, DataOffset[ 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, DataOffset[ 15], 22, 1236535329);
                a = md5_gg(a, b, c, d, DataOffset[ 1], 5, -165796510);
                d = md5_gg(d, a, b, c, DataOffset[ 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, DataOffset[ 11], 14, 643717713);
                b = md5_gg(b, c, d, a, DataOffset[ 0], 20, -373897302);
                a = md5_gg(a, b, c, d, DataOffset[ 5], 5, -701558691);
                d = md5_gg(d, a, b, c, DataOffset[ 10], 9, 38016083);
                c = md5_gg(c, d, a, b, DataOffset[ 15], 14, -660478335);
                b = md5_gg(b, c, d, a, DataOffset[ 4], 20, -405537848);
                a = md5_gg(a, b, c, d, DataOffset[ 9], 5, 568446438);
                d = md5_gg(d, a, b, c, DataOffset[ 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, DataOffset[ 3], 14, -187363961);
                b = md5_gg(b, c, d, a, DataOffset[ 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, DataOffset[ 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, DataOffset[ 2], 9, -51403784);
                c = md5_gg(c, d, a, b, DataOffset[ 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, DataOffset[ 12], 20, -1926607734);
                a = md5_hh(a, b, c, d, DataOffset[ 5], 4, -378558);
                d = md5_hh(d, a, b, c, DataOffset[ 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, DataOffset[ 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, DataOffset[ 14], 23, -35309556);
                a = md5_hh(a, b, c, d, DataOffset[ 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, DataOffset[ 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, DataOffset[ 7], 16, -155497632);
                b = md5_hh(b, c, d, a, DataOffset[ 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, DataOffset[ 13], 4, 681279174);
                d = md5_hh(d, a, b, c, DataOffset[ 0], 11, -358537222);
                c = md5_hh(c, d, a, b, DataOffset[ 3], 16, -722521979);
                b = md5_hh(b, c, d, a, DataOffset[ 6], 23, 76029189);
                a = md5_hh(a, b, c, d, DataOffset[ 9], 4, -640364487);
                d = md5_hh(d, a, b, c, DataOffset[ 12], 11, -421815835);
                c = md5_hh(c, d, a, b, DataOffset[ 15], 16, 530742520);
                b = md5_hh(b, c, d, a, DataOffset[ 2], 23, -995338651);
                a = md5_ii(a, b, c, d, DataOffset[ 0], 6, -198630844);
                d = md5_ii(d, a, b, c, DataOffset[ 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, DataOffset[ 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, DataOffset[ 5], 21, -57434055);
                a = md5_ii(a, b, c, d, DataOffset[ 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, DataOffset[ 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, DataOffset[ 10], 15, -1051523);
                b = md5_ii(b, c, d, a, DataOffset[ 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, DataOffset[ 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, DataOffset[ 15], 10, -30611744);
                c = md5_ii(c, d, a, b, DataOffset[ 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, DataOffset[ 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, DataOffset[ 4], 6, -145523070);
                d = md5_ii(d, a, b, c, DataOffset[ 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, DataOffset[ 2], 15, 718787259);
                b = md5_ii(b, c, d, a, DataOffset[ 9], 21, -343485551);
                H[0] = safeAdd(a, H[0]);
                H[1] = safeAdd(b, H[1]);
                H[2] = safeAdd(c, H[2]);
                H[3] = safeAdd(d, H[3]);
        },

        doFinalize(string, isUpper) {
            // Shortcuts
            let me = this,
                utftext = Ext.util.Base64.utf8Encode(string),
                data = me.getBytes(utftext),
                ln = utftext.length * 8;

            // Add padding
            data[ln >> 5] |= 0x80 << (24 - ln % 32);
            data[((ln + 64 >> 9) << 4) + 15] = ln;
            console.log(data)

            // data[ln >> 5] |= 0x80 << ((ln) % 32);
            // data[(((ln + 64) >>> 9) << 4) + 14] = ln;

            // Hash final blocks
            me.process(data);

            // Return final computed hash
            return me.toHexString(me.bytesToUtf8(me.hash), isUpper);
        }

    
    }// end privates


});