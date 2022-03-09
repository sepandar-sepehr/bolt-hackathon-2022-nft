'use strict';

require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const contractAddress = "0x18dec4D7dBCAb4c4d25aFa463a09d781C49b5aaa"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

    //the transaction
    const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    }

    const txReceipt = await performTransaction(tx)
    let tokenID = web3.utils.hexToNumber(txReceipt.logs[0].topics[3]);
    console.log('tokenID: ' + tokenID);
    return tokenID
}

async function sendToken(walletId, tokenID) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

    //the transaction
    const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.safeTransferFrom(PUBLIC_KEY, walletId, tokenID.toString()).encodeABI(),
    }

    await performTransaction(tx)

    return `successful transfer of ${tokenID} to ${walletId}`
}

function performTransaction(tx) {
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    return signPromise
        .then((signedTx) => {
            return web3.eth.sendSignedTransaction(
                signedTx.rawTransaction,
                function (err, hash) {
                    if (!err) {
                        console.log(
                            "The hash of your transaction is: ",
                            hash,
                            "\nCheck Alchemy's Mempool to view the status of your transaction!"
                        )
                    } else {
                        console.log(
                            "Something went wrong when submitting your transaction:",
                            err
                        )
                    }
                }
            ).then(
                txReceipt => {
                    console.log('receipt for tx: ')
                    console.log(txReceipt)
                    return txReceipt
                }
            )
        })
        .catch((err) => {
            console.log(" Promise failed:", err)
        })
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}


// mintNFT(
//     "https://gateway.pinata.cloud/ipfs/QmaiU2NFMHFSKiWxXV9kSCtafJijUkE4PJM34Xs9o874uN"
// )
module.exports = {sendToken, mintNFT}
