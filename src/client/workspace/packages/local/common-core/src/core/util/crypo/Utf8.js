/**
 * 来源：JavaScript library of crypto standards.
 * URL：https://github.com/brix/crypto-js
 */
Ext.define('Common.core.util.crypo.Utf8', {
    alternateClassName: 'Utf8',
    singleton: true,

    requires:[
        'Common.core.util.crypo.Latin1'
    ],

    /**
     * Converts a word array to a UTF-8 string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The UTF-8 string.
     *
     * @static
     *
     * @example
     *
     *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
     */
    stringify (wordArray) {
        try {
            return decodeURIComponent(encodeURIComponent(Latin1.stringify(wordArray)));
        } catch (e) {
            throw new Error('Malformed UTF-8 data');
        }
    },

    /**
     * Converts a UTF-8 string to a word array.
     *
     * @param {string} utf8Str The UTF-8 string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
     */
    parse(utf8Str) {
        return Latin1.parse(decodeURIComponent(encodeURIComponent(utf8Str)));
    }


})