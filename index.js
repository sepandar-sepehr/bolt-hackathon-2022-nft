// 'use strict';

// const Koa = require('koa');
// const Router = require('@koa/router');
const serve = require('koa-static');
// var bodyParser = require('koa-body-parser');

// const MintNFT = require("./scripts/mint-nft");
// const PinFile = require("./scripts/pin-file");

// const app = new Koa();
// const router = new Router();

// router.get('/', serve('./frontend'));

// // technically this has to be a "post" but just to make our lives easier for hackathon to use browser made it get
// router.get('/transfer/:receiverWalletId', (ctx, next) => {
// 	console.log(ctx.params.receiverWalletId)
// 	PinFile.pinFileToIPFS().then(function (response) {
// 		PinFile.pinJSONToIPFS(response.ipfsHash, response.fileName).then(function (tokenURI) {
// 			MintNFT.mintNFT(tokenURI).then(function (tokenID) {
// 				MintNFT.sendToken(ctx.params.receiverWalletId, tokenID)
// 					.then(result => {
// 						console.log(result)
// 					});
// 			})
// 		})
// 	})
// 	ctx.response.status = 200;
// 	ctx.body = 'Transferring a new NFT asynchronously'
// });

// app.use(bodyParser());

// router.post('/mint', async (ctx, next) => {
// 	console.log(ctx.request)
// 	ctx.response.status = 200;
// 	ctx.body = 'checkcheck'
// })

// // app.use(serve('./frontend'));
// app
// 	.use(router.routes())
// 	.use(router.allowedMethods());


// app.listen(1234);


const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('@koa/router');
const multer = require('@koa/multer');

const app = new Koa();
const router = new Router();
const upload = multer(); // note you can pass `multer` options here

// add a route for uploading multiple files
router.post(
	'/upload-multiple-files',
	upload.fields([
		{
			name: 'avatar',
			maxCount: 1
		},
		{
			name: 'boop',
			maxCount: 2
		}
	]),
	ctx => {
		console.log('ctx.request.files', ctx.request.files);
		console.log('ctx.files', ctx.files);
		console.log('ctx.request.body', ctx.request.body);
		ctx.body = 'done';
	}
);

// add a route for uploading single files
router.post(
	'/mint',
	koaBody({
		multipart: true,
		formidable: {
			maxFileSize: 1 * 1024 * 1024,
			keepExtensions: false,
			multiples: false,
		},
		onError: (err, ctx) => {
			console.log('Failed');
			ctx.body = "Failed";
		},
	}),
	ctx => {
		// console.log(ctx)
		// console.log('ctx.request.file', ctx.request.file);
		// console.log('ctx.file', ctx.file);
		// console.log('ctx.request.body', ctx.request.body);
		// ctx.body = 'done';
		console.log(ctx)
		// console.log(ctx.req.body)
		// console.log(ctx.req.file)
		// ctx.req.on('data', (data) => {
		// 	console.log(data.toString());
		// })
	}
);

// add the router to our app
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve('./frontend'));

// start the server
app.listen(3000);