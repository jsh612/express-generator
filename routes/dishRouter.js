// const express = require('express');
// const bodyParser = require('body-parser');

// const dishRouter = express.Router();
// const dishIdRouter = express.Router({mergeParams: true});

// dishRouter.use(bodyParser.json());
// dishIdRouter.use(bodyParser.json());

// dishRouter.route('/')
//     .all((req, res, next) => {
//         res.statusCode = 200;
//         res.setHeader('Content-type', 'text/plain');
//         next();
//         //next() : 다음 미들웨어로 넘어감. 없을경우 더 이상 진행 안되므로 반드시 넣어주기
//         //         만약에 여기서 req, res가 수정되었을 경우 그 수정을 다음 미들웨어로 전달한다.
//         //         (ex) 22번줄에서 작성된 미들웨어에 수정된 req, res가 전달 된다.
//     })
//     .get((req, res, next) =>{
//         res.end('Will send all the dishes to you!!!');
//     })
//     .post((req, res, next) => {
//         res.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`);
//     })
//     .put((req, res, next) => {
//         res.statusCode = 403;
//         res.end(`PUT operation not supported on /dishes`);
//     })
//     .delete((req, res, next) =>{
//         res.end('Deleting all the dishes!!');
//     });


// dishIdRouter.route('/')
//     .get((req, res, next) =>{
//         console.log("1",req.path)
//         res.end(`Will send details of dishes!! ${req.params.dishId} to you!!`);
//     })
//     .post((req, res, next) => {
//         res.statusCode = 403;
//         res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
//     })
//     .put((req, res, next) => {
//         res.write(`updating the dish: ${req.params.dishId} \n`);
//         res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`)
//     })
//     .delete((req, res, next) =>{
//         res.end(`Deleting dish: ${req.params.dishId}`);
//     });


// module.exports = {dishRouter, dishIdRouter};

const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
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

dishRouter.route('/:dishId')
        .all((req, res, next) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            next();
        })
        .get((req, res, next) => {
            res.end('Will send the dish: '+ req.params.dishId+ ' to you!');
        })
        .post((req, res, next) => {
            res.end('POST operation not supported on /dishes.');
        })
        .put((req, res, next) => {
            res.statusCode = 403;
            res.end('Updating the dish: '+ req.params.dishId+" Will update the dish: "+ req.params.dishId);
        })
        .delete((req, res, next) => {
            res.end('Deleting dish:'+ req.params.dishId);
        });


module.exports = dishRouter;