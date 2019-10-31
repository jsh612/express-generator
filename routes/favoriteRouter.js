const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Favorites = require("../models/favorites");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

/* 
 route /
 */

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    // 클라이언트는 preflight에 옵션을 포함시켜 보낼것이다. 이를 처리하기위해 작성.
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user.id })
      .populate("user")
      .populate("dishes")
      .then(
        favorietes => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorietes);
        },
        err => next(err)
      );
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      const favorite = await Favorites.findOne({ user: req.user.id });
      Favorites.remove({})
        .then(
          response => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
          },
          err => next(err)
        )
        .catch(err => next(err));
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported here.");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported here.");
  });

/* 
 route /:id
 */

favoriteRouter
  .route("/:id")
  .options(cors.corsWithOptions, (req, res) => {
    // 클라이언트는 preflight에 옵션을 포함시켜 보낼것이다. 이를 처리하기위해 작성.
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user.id })
      .populate("user")
      .populate("dishes")
      .then(
        favorietes => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorietes);
        },
        err => next(err)
      );
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      const { params: id } = req;
      const favorite = await Favorites.findOne({ user: req.user.id });
      try {
        favorite.dishes.pull(id);
        favorite.save();
      } catch (error) {
        next(error);
      }
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported here.");
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      const { params: id } = req;
      const favorite = await Favorites.findOne({ user: req.user.id });
      try {
        favorite.dishes.push(id);
        favorite.save();
      } catch (error) {
        next(error);
      }
    }
  );
