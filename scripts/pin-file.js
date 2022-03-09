'use strict';

//imports needed for this function
require("dotenv").config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const pinataApiKey = process.env.PINATA_API_KEY
const pinataSecretApiKey = process.env.PINATA_API_SECRET

async function pinFileToIPFS() {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    const randomImageName = selectRandomImage();
    console.log(`Uploading ${randomImageName}`)
    data.append('file', fs.createReadStream(`bolt_nft_images/${randomImageName}`));

    //You'll need to make sure that the metadata is in the form of a JSON object that's been converted to a string
    //metadata is optional
    const metadata = JSON.stringify({
        name: 'testname',
        // keyvalues: {
        //     exampleKey: 'exampleValue'
        // }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', pinataOptions);

    return makePostCall(url, data, `multipart/form-data; boundary=${data._boundary}`)
        .then(function(ipfsHash) {
            const fileName = 'Bolter-' + randomImageName
            return {ipfsHash, fileName}
    })
}

async function pinJSONToIPFS(ipfsHash, fileName){
    let jsonTemplate = fs.readFileSync('templates/ipfs_template.json', 'utf8');
    jsonTemplate = jsonTemplate.replace("${ipfs_hash}", ipfsHash).replace(/\${file_name\}/g, fileName)
    const JSONBody = JSON.parse(jsonTemplate)
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return makePostCall(url, JSONBody, 'application/json')
        .then(function (ipfsHash) {
            return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        })
}

function makePostCall(url, data, contentType) {
    return axios.post(url, data, {
        maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
        headers: {
            'Content-Type': contentType,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
        }
    }).then(function (response) {
        console.log('got ipfs response:')
        console.log(response)
        return response.data.IpfsHash
        //handle response here
    }).catch(function (error) {
        console.error(error)
        return error
        //handle error here
    });
}

function selectRandomImage() {
    const files = fs.readdirSync('bolt_nft_images');
    const selectedFileIndex = Math.floor( Math.random() * files.length)
    return files[selectedFileIndex]
}

// pinFileToIPFS().then(function (response) {
//     pinJSONToIPFS(response.ipfsHash, response.fileName).then(function (response){
//         console.log('token URI:')
//         console.log(response)
//     })
// })
module.exports = {pinFileToIPFS, pinJSONToIPFS}
