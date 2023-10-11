/**
 * 来源：JavaScript library of crypto standards.
 * URL：https://github.com/brix/crypto-js
 */
Ext.define('Common.core.util.crypo.Latin1', {
    alternateClassName: 'Latin1',
    singleton: true,

    /**
     * Converts a word array to a Latin1 string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The Latin1 string.
     *
     * @static
     *
     * @example
     *
     *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
     */
    stringify(wordArray) {
        // Shortcuts
        let words = wordArray.words,
            sigBytes = wordArray.sigBytes;

        // Convert
        let latin1Chars = [];
        for (let i = 0; i < sigBytes; i++) {
            let bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            latin1Chars.push(String.fromCharCode(bite));
        }

        return latin1Chars.join('');
    },

    /**
     * Converts a Latin1 string to a word array.
     *
     * @param {string} latin1Str The Latin1 string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
     */
    parse (latin1Str) {
        // Shortcut
        let latin1StrLength = latin1Str.length;

        // Convert
        let words = [];
        for (let i = 0; i < latin1StrLength; i++) {
            words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
        }

        return WordArray.getInstance(words, latin1StrLength);
    }


})