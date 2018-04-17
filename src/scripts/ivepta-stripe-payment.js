'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import stripe from 'stripe';

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/payment', (req,res) => {
  var ctx = req.webtaskContext;
  var STRIPE_SECRET_KEY = ctx.secrets.STRIPE_SECRET_KEY;

  stripe(STRIPE_SECRET_KEY).charges.create({
    amount: req.body.amount,
    currency: 'USD',
    source: req.body.stripeToken,
    receipt_email: req.body.email,
    description: req.body.description
  }, (err, charge) => {
    const status = err ? 400: 200;
    const message = err ? err.message: 'Payment done!';
    // res.writeHead(status, { 'Content-Type': 'text/html' });
    // return res.end('<h1>' + message + '</h1>');
    res.redirect('https://www.islandviewpta.org/thankyou/');
  });
});

module.exports = fromExpress(app);  
