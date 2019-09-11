// const express = require('express');
// const bodyParser = require('body-parser');

// const promotionsRouter = express.Router();
// const promoIdRouter = express.Router({mergeParams: true});

// promotionsRouter.use(bodyParser.json());
// promoIdRouter.use(bodyParser.json());

// promotionsRouter.route('/')
//     .all((req, res, next) => {
//         res.statusCode = 200;
//         res.setHeader('Content-type', 'text/plain');
//         next();
//     })
//     .get((req, res, next) =>{
//         res.end('Will send all the promotions to you!!!');
//     })
//     .post((req, res, next) => {
//         res.end(`Will add the promotion: ${req.body.name} with details: ${req.body.description}`);
//     })
//     .put((req, res, next) => {
//         res.statusCode = 403;
//         res.end(`PUT operation not supported on /promotions`);
//     })
//     .delete((req, res, next) =>{
//         res.end('Deleting all the promotions!!');
//     })

// promoIdRouter.route('/')
//     .get((req, res, next) =>{
//         res.end(`Will send details of promotions!! ${req.params.promoId} to you!!`);
//     })
//     .post((req, res, next) => {
//         res.statusCode = 403;
//         res.end(`POST operation not supported on /promotions/${req.params.promoId}`);
//     })
//     .put((req, res, next) => {
//         res.write(`updating the promotion: ${req.params.promoId} \n`);
//         res.end(`Will update the promotion: ${req.body.name} with details: ${req.body.description}`)
//     })
//     .delete((req, res, next) =>{
//         res.end(`Deleting promotion: ${req.params.promoId}`);
//     });

// module.exports = {promoIdRouter, promotionsRouter};

const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the dishes to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the dish: ' + req.body.name + ', with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported here.');
    })
    .delete((req, res, next) => {
        res.end('Deleting all dishes');
    });

   
promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
        })
    .get((req, res, next) => {
        res.end('Will send the dish: ' + req.params.promoId + ' to you!');
        })
    .post((req, res, next) => {
        res.end('Will add the promotion: ' + req.body.name + " with deatils" + req.body.description);
        })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Will add the promotion: ' + req.body.name + " with deatils" + req.body.description);
        })
    .delete((req, res, next) => {
         res.end('Deleting dish: ' + req.params.promoId);
         });


module.exports = promoRouter;