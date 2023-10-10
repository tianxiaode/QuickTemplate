/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://anmar.eu.org/projects/jssha2/
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
Ext.define('Common.core.util.crypo.Sha256', {
    extend: 'Common.core.util.crypo.Base',
    alternateClassName: 'SHA256',
    singleton: true,

    requires:[
        'Ext.util.Base64'
    ],

    hexcase: 0,  /* hex output format. 0 - lowercase; 1 - uppercase        */
    b64pad: "", /* base-64 pad character. "=" for strict RFC compliance   */
    
    get(string, isUpper) {
        let me = this,
            utftext = Ext.util.Base64.utf8Encode(string),
            bytes = me.getBytes(utftext),
            block = me.process(bytes, utftext.length * 8),
            result = me.bytesToUtf8(block);
        return me.toHexString(result, isUpper);

    },

    destroy() {
        this.destroyMembers('H', 'K');
        this.callParent();
    },

    privates: {

        blockSize: 16,
        minBufferSize: 0,

        H: [1779033703, -1150833019, 1013904242, -1521486534,
            1359893119, -1694144372, 528734635, 1541459225],

        K: [
            1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
            -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
            1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
            264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
            -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
            113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
            1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
            -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
            430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
            1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
            -1866530822, -1538233109, -1090935817, -965641998
        ],

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
        * Main sha256 , with its support s
        */
        sha256_S(X, n) {
            return (X >>> n) | (X << (32 - n));
        },
        sha256_R(X, n) {
            return (X >>> n);
        },
        sha256_Ch(x, y, z) {
            return ((x & y) ^ ((~x) & z));
        },
        sha256_Maj(x, y, z) {
            return ((x & y) ^ (x & z) ^ (y & z));
        },
        sha256_Sigma0256(x) {
            let me = this;
            return (me.sha256_S(x, 2) ^ me.sha256_S(x, 13) ^ me.sha256_S(x, 22));
        },
        sha256_Sigma1256(x) {
            let me = this;
            return (me.sha256_S(x, 6) ^ me.sha256_S(x, 11) ^ me.sha256_S(x, 25));
        },
        sha256_Gamma0256(x) {
            let me = this;
            return (me.sha256_S(x, 7) ^ me.sha256_S(x, 18) ^ me.sha256_R(x, 3));
        },
        sha256_Gamma1256(x) {
            let me = this;
            return (me.sha256_S(x, 17) ^ me.sha256_S(x, 19) ^ me.sha256_R(x, 10));
        },
        sha256_Sigma0512(x) {
            let me = this;
            return (me.sha256_S(x, 28) ^ me.sha256_S(x, 34) ^ me.sha256_S(x, 39));
        },
        sha256_Sigma1512(x) {
            let me = this;
            return (me.sha256_S(x, 14) ^ me.sha256_S(x, 18) ^ me.sha256_S(x, 41));
        },
        sha256_Gamma0512(x) {
            let me = this;
            return (me.sha256_S(x, 1) ^ me.sha256_S(x, 8) ^ me.sha256_R(x, 7));
        },
        sha256_Gamma1512(x) {
            let me = this;
            return (me.sha256_S(x, 19) ^ me.sha256_S(x, 61) ^ me.sha256_R(x, 6));
        },

        process(m, l) {
            let me = this,
                H = me.H.slice(0),
                K = me.K,
                W = [],
                a, b, c, d, e, f, g, h, i, j, T1, T2;


            /* append padding */
            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;

            for (i = 0; i < m.length; i += 16) {
                [a, b, c, d, e, f, g, h] = H;

                for (j = 0; j < 64; j++) {
                    if (j < 16) {
                        W[j] = m[j + i];
                    }
                    else {
                        W[j] = me.safeAdd(me.safeAdd(me.safeAdd(me.sha256_Gamma1256(W[j - 2]), W[j - 7]),
                            me.sha256_Gamma0256(W[j - 15])), W[j - 16]);
                    }

                    T1 = me.safeAdd(me.safeAdd(me.safeAdd(me.safeAdd(h, me.sha256_Sigma1256(e)), me.sha256_Ch(e, f, g)),
                        K[j]), W[j]);
                    T2 = me.safeAdd(me.sha256_Sigma0256(a), me.sha256_Maj(a, b, c));
                    h = g;
                    g = f;
                    f = e;
                    e = me.safeAdd(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = me.safeAdd(T1, T2);
                }

                H[0] = me.safeAdd(a, H[0]);
                H[1] = me.safeAdd(b, H[1]);
                H[2] = me.safeAdd(c, H[2]);
                H[3] = me.safeAdd(d, H[3]);
                H[4] = me.safeAdd(e, H[4]);
                H[5] = me.safeAdd(f, H[5]);
                H[6] = me.safeAdd(g, H[6]);
                H[7] = me.safeAdd(h, H[7]);
            }
            return H;
        },


    
    }// end privates

})