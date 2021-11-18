const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require("mongoose");
const TError = require ('./models/TError');

mongoose
	.connect(global.process.env.NODE_ENV === 'production' ? 'mongodb://root:mongo@srv-captain--mongo/telanco?authSource=admin' : 'mongodb://localhost:27017/telanco', { useNewUrlParser: true })
	.then(() => {
		const app = express();
		app.set('view engine', 'ejs');
		app.use(cookieParser('bonner'));
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.use(session({
			secret: 'bonner',
			resave: false,
  			saveUninitialized: true
		}));

		app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		app.get('/', async function(req, res) {
			res.send('Hello World!');
		});

		app.get('/view-secret-url-1389920', async function(req, res) {
			const errors = await TError.getAllErrors();
			res.render('index', { req, errors });
		});

		app.post('/report', async function(req, res) {
			if(!req.body.error) {
				TError.newError(req, {
					website: 'INTERNAL',
					errorMessage: `Recieved a POST request without a error element in body.`
				});

				return res.status(400).json({});
			}
			
			TError.newError(req, req.body.error);
			res.json({});
		});

		app.listen(5000, async () => {
			console.log("Server has started!");
		});
	});
