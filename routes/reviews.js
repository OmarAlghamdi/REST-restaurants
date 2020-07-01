const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const DataProvider = require('../persistent/json-data-provider');

const data = new DataProvider(path.resolve('./data'));

const reviewRouter =  express.Router();
reviewRouter.use(bodyParser.json());

/**
 * PATH: /api/reviews
 * METHODS:
 *      POST:   body-args: restaurant, user, rating, comments
 */
reviewRouter.route('/')
    .all( (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .post( (req, res) => {
        const { restaurant, user, rating, comments } = req.body;

        data.addReview(restaurant, user, rating, comments)
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    });

/**
 * PATH:    /api/reviews
 * PARAMS:  <Number>    restauran_Id
 * METHODS:
 *      GET:   reviews for a particular restaurant
 */
reviewRouter.route('/:restaurant')
    .all( (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get( (req, res) => {
        const { restaurant } = req.params;

        data.getReviews(restaurant)
            .then(reviews => res.json(reviews))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    });

/**
 * PATH:    /api/reviews
 * PARAMS:  <Number>,<Number>    restauran_Id, review index
 * METHODS:
 *      GET:   a particular review
 */
reviewRouter.route('/:restaurant/:id')
    .all( (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get( (req, res) => {
        const { restaurant, id } = req.params;

        data.getReview(restaurant, id)
            .then(review => res.json(review))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            })
    })

/**
 * PATH:    /api/reviews
 * PARAMS:  <Number>    review index
 * METHODS:
 *      PUT:   updates a reivew
 *             body-args: restaurant, user, rating, comments
 *      DELETE: 
 */
reviewRouter.route('/:id')
    .all( (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .put( (req, res) => {
        const { id } = req.params;
        const { restaurant, user, rating, comments } = req.body;

        data.updateReview(id, restaurant, user, rating, comments )
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            })
    })
    .delete( (req, res) => {
        const { id } = req.params;

        data.deleteReview(id)
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            })
    })

module.exports = reviewRouter;