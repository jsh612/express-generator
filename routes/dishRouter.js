const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
            .populate('comments.author')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    //authenticate.verifyUser 미들웨어는 인증을 요구를 적용 한것.
    .post(authenticate.verifyUser ,(req, res, next) => {
        console.log('인증확인')
        Dishes.create(req.body)
            .then(dish => {
                console.log('Dish created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported here.');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response)
            }, (err) => next(err))
            .catch(err => next(err))
    });

dishRouter.route('/:dishId')
        .get((req, res, next) => {
            Dishes.findById(req.params.dishId)
                .populate('comments.author')
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish)
                }, (err) => next(err))
                .catch(err => next(err))
        })
        .post(authenticate.verifyUser, (req, res, next) => {
            res.end('POST operation not supported on /dishes.');
        })
        .put(authenticate.verifyUser, (req, res, next) => {
            Dishes.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, {new: true})
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish)
                }, (err) => next(err))
                .catch(err => next(err))
        })
        .delete(authenticate.verifyUser, (req, res, next) => {
            Dishes.findByIdAndRemove(req.params.dishId)
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response)
                }, (err) => next(err))
                .catch(err => next(err))
        });


dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish !== null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                } else {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch(err => next(err))
            //에러는 나중에 한번에 처리하기위해 next로 넘긴다.
            //app.js 의 마지막 부분의 error handler에서 처리함.
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if (dish !== null) {
                    //- 이미 포스트할때 인증이 되었기때문에 req.user에 정보가있다.
                    //- 동작 과정: author 정보는 클라이언트가 명시적으로 request로 전달해 오는 것이 아니라, 
                    //        우리의 authenticate 과정에서 파악하여 자동으로 db에 입력
                    //- req.body 에는 코멘트 내용들이 있을 것이다.
                    req.body.author = req.user._id

                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err))
                } else {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported here.'
            + req.params.dishId + '/comments');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish !== null) {
                    for (let i= (dish.comments.length-1); i>=0; i--) {
                        console.log('/:dishId/comments 삭제부분',dish.comments.id(dish.comments[i]._id))
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err))
                } else {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch(err => next(err))
    });


dishRouter.route('/:dishId/comments/:commentId')
        .get((req, res, next) => {
            Dishes.findById(req.params.dishId)
                .populate('comments.author')
                .then(dish => {
                    if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish.comments.id(req.params.commentId));
                    } else if (dish === null) {
                        err = new Error('Dish' + req.params.dishId + 'not found');
                        err.statusCode = 404;
                        return next(err);
                    } else {
                        err = new Error('Comments' + req.params.commentId + 'not found');
                        err.statusCode = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch(err => next(err))
        })
        .post(authenticate.verifyUser, (req, res, next) => {
            res.end('POST operation not supported on /dishes' + req.params.dishId
                + '/comments/' + req.params.commentId );
        })
        .put(authenticate.verifyUser, (req, res, next) => {
            Dishes.findById(req.params.dishId)
                .then(dish => {
                    console.log("id 메소드:::::",dish.comments.id)
                    if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
                        if (req.body.rating) {
                            dish.comments.id(req.params.commentId).rating = req.body.rating;
                        }
                        if (req.body.comment) {
                            dish.comments.id(req.params.commentId).comment = req.body.comment;
                        }
                        dish.save()
                            .then((dish) => {
                                //population 을 위해 다시한번 모델속에서 해당 코멘트를 찾아준다.
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then((dish) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(dish);
                                    })
                            }, (err) => next(err))
                    } else if (dish === null) {
                        err = new Error('Dish' + req.params.dishId + 'not found');
                        err.statusCode = 404;
                        return next(err);
                    } else {
                        err = new Error('Comments' + req.params.commentId + 'not found');
                        err.statusCode = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch(err => next(err))
        })
        .delete(authenticate.verifyUser, (req, res, next) => {
            Dishes.findByIdAndRemove(req.params.dishId)
                .then((dish) => {
                    if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
                        dish.comments.id(req.params.commentId).remove();
                        dish.save()
                            .then((dish) => {
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then((dish) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(dish);
                                    })
                            }, (err) => next(err))
                    } else if (dish === null) {
                        err = new Error('Dish' + req.params.dishId + 'not found');
                        err.statusCode = 404;
                        return next(err);
                    } else {
                        err = new Error('Comments' + req.params.commentId + 'not found');
                        err.statusCode = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                    .catch(err => next(err))
        });

module.exports = dishRouter;




