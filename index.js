'use strict';
// import * as Web3 from 'web3'
// import { OpenSeaPort, Network } from 'opensea-js'

const Web3 = require('web3')
const { OpenSeaPort, Network } = require('opensea-js')

const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'Hello World';
});

const accountAddress = '0x7aaa2785baaf248b91fbc64b70280bcf3ddd4e09';
const tokenAddress = '0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656';
const tokenID = '87787896460721781419097609855645980354241538650715174651679292838257566416897'

router.get('/assets', (ctx, next) => {
    // This example provider won't let you make transactions, only read-only calls:
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io')

    const seaport = new OpenSeaPort(provider, {
        networkName: Network.Rinkeby,
       // apiKey: YOUR_API_KEY
    })

    //getAsset(seaport);
});

async function getAsset(seaport) {
    try {
        // const asset = await seaport.getTokenBalance({
        //     accountAddress, // string
        //     tokenAddress, // string | number | null
        // });

        const asset = await seaport.api.getAsset({
            tokenAddress, // string
            tokenID, // string | number | null
          })
        console.log(asset);
        return asset;
    } catch (e) {
        console.log(e.message);
        return null;
    }
    
}


app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(1234);