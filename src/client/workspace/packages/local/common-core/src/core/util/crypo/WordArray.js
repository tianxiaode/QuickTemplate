Ext.define('Common.core.util.crypo.WordArray', {
    alternateClassName: 'WordArray',


    requires: [
        'Common.core.util.crypo.Hex'
    ],

    statics:{        
        getInstance(words, sigBytes){
            let instance = Ext.create('Common.core.util.crypo.Hex');
            instance.init(words, sigBytes);
            return instance;
        }
    },

    /**
     * Initializes a newly created word array.
     *
     * @param {Array} words (Optional) An array of 32-bit words.
     * @param {number} sigBytes (Optional) The number of significant bytes in the words.
     *
     * @example
     *
     *     var wordArray = CryptoJS.lib.WordArray.create();
     *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
     *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
     */
    init(words, sigBytes) {
        let me = this;
        words = me.words = words || [];

        if (sigBytes != undefined) {
            me.sigBytes = sigBytes;
        } else {
            me.sigBytes = words.length * 4;
        }
    },

    /**
     * Converts this word array to a string.
     *
     * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
     *
     * @return {string} The stringified word array.
     *
     * @example
     *
     *     var string = wordArray + '';
     *     var string = wordArray.toString();
     *     var string = wordArray.toString(CryptoJS.enc.Utf8);
     */
    toString(encoder) {
        return (encoder || Hex).stringify(this);
    },

    /**
     * Concatenates a word array to this word array.
     *
     * @param {WordArray} wordArray The word array to append.
     *
     * @return {WordArray} This word array.
     *
     * @example
     *
     *     wordArray1.concat(wordArray2);
     */
    concat (wordArray) {
        // Shortcuts
        let me = this,
            thisWords = me.words,
            thatWords = wordArray.words,
            thisSigBytes = me.sigBytes,
            thatSigBytes = wordArray.sigBytes;

        // Clamp excess bits
        me.clamp();

        // Concat
        if (thisSigBytes % 4) {
            // Copy one byte at a time
            for (let i = 0; i < thatSigBytes; i++) {
                let thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
            }
        } else {
            // Copy one word at a time
            for (let j = 0; j < thatSigBytes; j += 4) {
                thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
            }
        }
        me.sigBytes += thatSigBytes;

        // Chainable
        return me;
    },

    /**
     * Removes insignificant bits.
     *
     * @example
     *
     *     wordArray.clamp();
     */
    clamp() {
        // Shortcuts
        let words = me.words
            sigBytes = me.sigBytes;

        // Clamp
        words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
        words.length = Math.ceil(sigBytes / 4);
    },

    /**
     * Creates a copy of this word array.
     *
     * @return {WordArray} The clone.
     *
     * @example
     *
     *     var clone = wordArray.clone();
     */
    clone() {
        return this.words.slice(0);
    },

    /**
     * Creates a word array filled with random bytes.
     *
     * @param {number} nBytes The number of random bytes to generate.
     *
     * @return {WordArray} The random word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.lib.WordArray.random(16);
     */
    random(nBytes) {
        var words = [];

        for (let i = 0; i < nBytes; i += 4) {
            words.push(me.cryptoSecureRandomInt());
        }

        return WordArray.getInstance(words, nBytes);
    },

    destroy() {
        this.destroyMembers('words');
        this.callParent();
    },


    privates:{
        cryptoSecureRandomInt () {
	        if (!crypto) {
                throw new Error('Native crypto module could not be used to get secure random number.');
            }
            // Use getRandomValues method (Browser)
            if (typeof crypto.getRandomValues === 'function') {
                try {
                    return crypto.getRandomValues(new Uint32Array(1))[0];
                } catch (err) {}
            }

            // Use randomBytes method (NodeJS)
            if (typeof crypto.randomBytes === 'function') {
                try {
                    return crypto.randomBytes(4).readInt32LE();
                } catch (err) {}
            }
        }

    }// end privates

});