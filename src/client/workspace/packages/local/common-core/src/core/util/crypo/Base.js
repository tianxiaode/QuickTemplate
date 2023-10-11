/**
 * 来源：JavaScript library of crypto standards.
 * URL：https://github.com/brix/crypto-js
 */
Ext.define('Common.core.util.crypo.Base', {

    requires: [
        'Common.core.util.crypo.Utf8',
        'Common.core.util.crypo.WordArray',
    ],

    blockSize: 512 / 32,
    minBufferSize: 0,

    get(string, isUpper) {
        let me = this;
        me.reset();
        let result = me.finalize(string).toString();
        return isUpper ? result.toUpperCase() : result.toLowerCase();
    },

    destroy() {
        this.destroyMembers('H', 'hash', 'data');
        this.callParent();
    },

    privates: {

        reset() {
            let me = this;
            me.data = WordArray.getInstance();
            me.nDataBytes = 0;
            me.hash = WordArray.getInstance(me.H.slice(0));

        },

        append(data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }
            // Append
            this.data.concat(data);
            this.nDataBytes += data.sigBytes;

        },

        finalize(string) {
            this.append(string);
            return this.doFinalize();
        },

        doFinalize() { },


        process(doFlush) {
            let me = this,
                processedWords,
                data = me.data,
                dataWords = data.words,
                dataSigBytes = data.sigBytes,
                blockSize = me.blockSize,
                blockSizeBytes = blockSize * 4,
                nBlocksReady = dataSigBytes / blockSizeBytes;

            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - me.minBufferSize, 0);
            }

            // Count words ready
            let nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            let nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                for (let offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    me.doProcessBlock(dataWords, offset);
                }

                // Remove processed words
                processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return WordArray.getInstance(processedWords, nBytesReady);
        }



    }
})