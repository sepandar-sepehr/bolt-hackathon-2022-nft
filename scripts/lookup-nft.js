const MintNFT = require("./mint-nft");

const WALLET_ID = "0xBcaB46CFc3eaF6BbA95D1c5aFeF6695472F6eB2f";

async function transferFromMerchantWallet(receiverWalletId){
    const assets = await nft_lookup()
    console.log(assets)
    randomAssetToTransfer = assets[0]
    console.log('random asset to transfer: ' + randomAssetToTransfer.token_id)
    return await MintNFT.sendToken(receiverWalletId, randomAssetToTransfer.token_id)
}

async function nft_lookup(){
    const sdk = require('api')('@opensea/v1.0#1j3wv35kyd6wqwc');

    const res = await sdk['retrieving-assets-rinkeby']({
        owner: WALLET_ID,
        order_direction: 'desc',
        offset: '0',
        limit: '20'
    })

    return res['assets']
}

// function selectRandomAsset(assets) {
//     console.log('selecting random asset from: ' + assets)
//     const selectedIndex = Math.floor( Math.random() * assets.length)
//     return assets[selectedIndex]
// }

module.exports = {
    transferFromMerchantWallet
}