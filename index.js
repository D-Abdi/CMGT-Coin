const axios = require("axios")
const hashing = require("./hashing");

let blockchain;
let transactions;
let generalTimeStamp;
let transactionInfo;

function main () {
    axios.get("https://programmeren9.cmgt.hr.nl:8000/api/blockchain/next").then((response) => {
        blockchain = response.data.blockchain;
        transactions = response.data.transactions;
        generalTimeStamp = response.data.timestamp;

        transactionInfo = `${blockchain.hash}${blockchain.data[0].from}${blockchain.data[0].to}${blockchain.data[0].amount}${blockchain.data[0].timestamp}${blockchain.timestamp}${blockchain.nonce}`
    }).then(() => {
        let separateDigits = hashing.createSeparateDigits(transactionInfo)
        let chunks = hashing.createChunks(separateDigits)
        let mod10Hash = hashing.handleChunkAccumulation(chunks[0], chunks, 1)
        let finalNonce = hashing.getFinalNonce(mod10Hash, transactions[0], generalTimeStamp);
        hashing.handleAddToChain(finalNonce)
    })
}

main();
