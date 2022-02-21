const sha256 = require("js-sha256");
const axios = require("axios")

const hashing = (function () {
    const createSeparateDigits = (string) => {
        // Remove whitespace from the string
        string = string.replace(/\s/g, '')
        let transactionInfoArr = [];

        // Check if items in array are numeric
        for (let i of string) {
            // If i is not ascii, make an ascii out if it
            if (!isNumeric(i)) {
                transactionInfoArr.push(ascii(i));
            } else {
                // Otherwise, just push
                transactionInfoArr.push(i);
            }
        }
        // 1. join the numbers together. 2.Split them up into separate digits. 3. Map over all of them and make them numbers
        return transactionInfoArr.join("").split("").map(Number);
    }

    const createChunks = (separateDigits) => {
        let i,
            j,
            temporary,
            chunk = 10,
            chunksArr = [];

        // Use loop to create separate chunks of 10 digits
        for (i = 0, j = separateDigits.length; i < j; i += chunk) {
            let x = 0;
            // Save the chunk in a temporary array
            temporary = separateDigits.slice(i, i + chunk);

            // Check if it's a multiple of 10
            while (temporary.length % 10 !== 0) {
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
        // Perform the loop until x reaches the complete chunk2 length
        if (chunk2 && x < chunk2.length) {
            for (let i = 0; i < 10; i++) {
                // Perform the formula on every number in the selected chunks
                chunk1[i] = (chunk1[i] + chunk2[x][i]) % 10;
            }
            // Return the same function with different arguments and increment x
            return handleChunkAccumulation(chunk1, chunk2, x + 1);
        } else {
            //  Create a string and hash it when no chunks are present to take from
            return sha256(chunk1.toString().split(",").join(""))
        }
    };

    const getFinalNonce = (mod10Hash, transactions, generalTimeStamp) => {
        let hash = "";
        let nonce = 0;

        // While hash does not start with "0000"
        while (!isHashValid(hash)) {
            //  Add to nonce
            nonce++;
            // Perform the whole hashing on the transaction string
            let input = `${mod10Hash}${transactions.from}${transactions.to}${transactions.amount}${transactions.timestamp}${generalTimeStamp}${nonce}`;
            let separateDigits = createSeparateDigits(input)
            let chunks = createChunks(separateDigits)
            hash = handleChunkAccumulation(chunks[0], chunks, 1)
        }

        return nonce;
    }

    // Create a string from the nonce and post it to the blockchain with a user
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

    // Method that checks if the value is numeric
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
