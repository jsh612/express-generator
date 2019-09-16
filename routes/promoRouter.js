const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((promotiones) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotiones)
            }, (err) => next(err))
            .catch(err => next(err))
            //에러는 나중에 한번에 처리하기위해 next로 넘긴다.
            //app.js 의 마지막 부분의 error handler에서 처리함.
    })
    .post((req, res, next) => {
        Promotions.create(req.body)
            .then(promotion => {
                console.log('Dish created', promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported here.');
    })
    .delete((req, res, next) => {
        Promotions.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response)
            }, (err) => next(err))
            .catch(err => next(err))
    });
   
promoRouter.route('/:promoId')
    .get((req, res, next) => {
            Promotions.findById(req.params.promoId)
                .then(promotion => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion)
                }, (err) => next(err))
                .catch(err => next(err))
    })
    .post((req, res, next) => {
        res.end('POST operation not supported on /promotiones.');
    })
    .put((req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, {new: true})
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .delete((req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response)
            }, (err) => next(err))
            .catch(err => next(err))
    });


module.exports = promoRouter;