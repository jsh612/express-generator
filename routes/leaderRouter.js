const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');

const leaderRoute = express.Router();

leaderRoute.use(bodyParser.json());

leaderRoute.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then((leaderes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaderes)
            }, (err) => next(err))
            .catch(err => next(err))
            //에러는 나중에 한번에 처리하기위해 next로 넘긴다.
            //app.js 의 마지막 부분의 error handler에서 처리함.
    })
    .post((req, res, next) => {
        Leaders.create(req.body)
            .then(leader => {
                console.log('Dish created', leader);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported here.');
    })
    .delete((req, res, next) => {
        Leaders.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response)
            }, (err) => next(err))
            .catch(err => next(err))
    });


leaderRoute.route('/:leaderId')
    .get((req, res, next) => {
            Leaders.findById(req.params.leaderId)
                .then(leader => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader)
                }, (err) => next(err))
                .catch(err => next(err))
        })
        .post((req, res, next) => {
            res.end('POST operation not supported on /leaderes.');
        })
        .put((req, res, next) => {
            Leaders.findByIdAndUpdate(req.params.leaderId, {
                $set: req.body
            }, {new: true})
                .then(leader => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader)
                }, (err) => next(err))
                .catch(err => next(err))
        })
        .delete((req, res, next) => {
            Leaders.findByIdAndRemove(req.params.leaderId)
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response)
                }, (err) => next(err))
                .catch(err => next(err))
        });  

module.exports = leaderRoute;                 