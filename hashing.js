const sha256 = require("js-sha256");
const axios = require("axios")

const hashing = (function () {
    const createSeparateDigits = (string) => {
        string = string.replace(/\s/g, '')
        let transactionInfoArr = [];

        // check if items in array are numeric
        for (let i of string) {
            // if not, make ascii out if it otherwise just push
            if (!isNumeric(i)) {
                transactionInfoArr.push(ascii(i));
            } else {
                transactionInfoArr.push(i);
            }
        }
        return transactionInfoArr.join("").split("").map(Number);
    }

    const createChunks = (separateDigits) => {
        let i,
            j,
            temporary,
            chunk = 10,
            chunksArr = [],
            lastRowModified = false;

        // Use loop to create separate chunks of 10 digits
        for (i = 0, j = separateDigits.length; i < j; i += chunk) {
            let x = 0;
            // Save the chunk in a temporary array
            temporary = separateDigits.slice(i, i + chunk);

            // Check if it's a multiple of 10
            while (temporary.length % 10 !== 0) {
                // If it's not, you will know it is the last row
                lastRowModified = true;
                // Add numbers from 0 to 10 until the total has become a multiple of 10
                temporary.push(x);
                x++;
            }
            // Push the chunk in a separate  array
            chunksArr.push(temporary);
        }
        return chunksArr;
    };

    const handleChunkAccumulation = (chunk1, chunk2, x) => {
        if (chunk2 && x < chunk2.length) {
            for (let i = 0; i < 10; i++) {
                chunk1[i] = (chunk1[i] + chunk2[x][i]) % 10;
            }
            return handleChunkAccumulation(chunk1, chunk2, x + 1);
        } else {
            return sha256(chunk1.toString().split(",").join(""))
        }
    };

    const getFinalNonce = (mod10Hash, transactions, generalTimeStamp) => {
        let hash = "";
        let nonce = 0;

        while (!isHashValid(hash)) {
            // Hash the input string
            nonce++;
            let input = `${mod10Hash}${transactions.from}${transactions.to}${transactions.amount}${transactions.timestamp}${generalTimeStamp}${nonce}`;
            let separateDigits = createSeparateDigits(input)
            let chunks = createChunks(separateDigits)
            hash = handleChunkAccumulation(chunks[0], chunks, 1)
        }

        console.log(hash, nonce, 'Hash')
        return nonce;
    }

    const handleAddToChain = (finalNonce) => {
        finalNonce = String(finalNonce)
        axios
            .post("https://programmeren9.cmgt.hr.nl:8000/api/blockchain", {
                "nonce": Number(finalNonce),
                "user": "Daniel Abdi 0975963",
            })
            .then((response) => {
                console.log(response.data, finalNonce);
            });
    };

    // a hash is valid if the four first characters are 0.
    const isHashValid = (hash) => hash.startsWith("0000"); // Difficulty

    // Method to change a character to its ascii code
    const ascii = (a) => {
        return a.charCodeAt(0);
    };

    const isNumeric = (val) => {
        return /^-?\d+$/.test(val);
    };

    return {
        createSeparateDigits,
        createChunks,
        handleChunkAccumulation,
        getFinalNonce,
        handleAddToChain
    }
})()

module.exports = hashing
