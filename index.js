'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const serve = require('koa-static');
var bodyParser = require('koa-body-parser');

const MintNFT = require("./scripts/mint-nft");
const PinFile = require("./scripts/pin-file");

const app = new Koa();
const router = new Router();

router.get('/', serve('./frontend'));

// technically this has to be a "post" but just to make our lives easier for hackathon to use browser made it get
router.get('/transfer/:receiverWalletId', (ctx, next) => {
	console.log(ctx.params.receiverWalletId)
	PinFile.pinFileToIPFS().then(function (response) {
		PinFile.pinJSONToIPFS(response.ipfsHash, response.fileName).then(function (tokenURI) {
			MintNFT.mintNFT(tokenURI).then(function (tokenID) {
				MintNFT.sendToken(ctx.params.receiverWalletId, tokenID)
					.then(result => {
						console.log(result)
					});
			})
		})
	})
	ctx.response.status = 200;
	ctx.body = 'Transferring a new NFT asynchronously'
});

app.use(bodyParser());

router.post('/mint', async (ctx, next) => {
	console.log(ctx.request)
	ctx.response.status = 200;
	ctx.body = 'checkcheck'
})

// app.use(serve('./frontend'));
app
	.use(router.routes())
	.use(router.allowedMethods());


app.listen(1234);
