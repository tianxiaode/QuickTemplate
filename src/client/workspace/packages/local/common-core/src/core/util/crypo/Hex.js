/**
 * 来源：JavaScript library of crypto standards.
 * URL：https://github.com/brix/crypto-js
 */
Ext.define('Common.core.util.crypo.Hex', {
    alternateClassName: 'Hex',
    singleton: true,

    /**
     * Converts a word array to a hex string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The hex string.
     *
     * @static
     *
     * @example
     *
     *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
     */
    stringify(wordArray) {
        // Shortcuts
        let words = wordArray.words,
            sigBytes = wordArray.sigBytes;

        // Convert
        let hexChars = [];
        for (let i = 0; i < sigBytes; i++) {
            let bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 0x0f).toString(16));
        }

        return hexChars.join('');
    },

    /**
     * Converts a hex string to a word array.
     *
     * @param {string} hexStr The hex string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
     */
    parse(hexStr) {
        // Shortcut
        let hexStrLength = hexStr.length;

        // Convert
        let words = [];
        for (let i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
        }

        return WordArray.getInstance(words, hexStrLength / 2);
    }


})