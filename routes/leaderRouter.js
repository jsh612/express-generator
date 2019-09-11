// const express = require('express');
// const bodyParser = require('body-parser');

// const leadersRouter = express.Router();
// const leadersIdRouter = express.Router({mergeParams: true});

// leadersRouter.use(bodyParser.json());
// leadersIdRouter.use(bodyParser.json());

// leadersRouter.route('/')
//     .all((req, res, next) => {
//         res.statusCode = 200;
//         res.setHeader('Content-type', 'text/plain');
//         next();
//     })
//     .get((req, res, next) =>{
//         res.end('Will send all the leaders to you!!!');
//     })
//     .post((req, res, next) => {
//         res.end(`Will add the leader: ${req.body.name} with details: ${req.body.description}`);
//     })
//     .put((req, res, next) => {
//         res.statusCode = 403;
//         res.end(`PUT operation not supported on /leaders`);
//     })
//     .delete((req, res, next) =>{
//         res.end('Deleting all the leaders!!');
//     })

 
// leadersIdRouter.route('/')
//     .get((req, res, next) =>{
//         res.end(`Will send details of leaders!! ${req.params.leaderId} to you!!`);
//     })
//     .post((req, res, next) => {
//         res.statusCode = 403;
//         res.end(`POST operation not supported on /leaders/${req.params.leaderId}`);
//     })
//     .put((req, res, next) => {
//         res.write(`updating the leader: ${req.params.leaderId} \n`);
//         res.end(`Will update the leaders: ${req.body.name} with details: ${req.body.description}`)
//     })
//     .delete((req, res, next) =>{
//         res.end(`Deleting leader: ${req.params.leaderId}`);
//     });

// module.exports = {leadersIdRouter, leadersRouter};


const express = require('express');
const bodyParser = require('body-parser');

const leaderRoute = express.Router();

leaderRoute.use(bodyParser.json());

leaderRoute.route('/')
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


leaderRoute.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
        })
    .get((req, res, next) => {
        res.end('Will send the leader: ' + req.params.leaderId + ' to you!');
        })
    .post((req, res, next) => {
        res.end('POST operation not supported on /leaders.');
        })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Will do the promotions: ' + req.params.leaderId+ " with detail" + req.params.leaderId);
        })
    .delete((req, res, next) => {
        res.end('Deleting dish: ' + req.params.leaderId);
        });    

module.exports = leaderRoute;                 