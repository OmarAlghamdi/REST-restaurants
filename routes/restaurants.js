const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const DataProvider = require('../persistent/json-data-provider');

const data = new DataProvider(path.resolve('./data'));

const restaurantRouter =  express.Router();
restaurantRouter.use(bodyParser.json());


restaurantRouter.route('/')
    .all( (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get( (req, res) => {
        data.getRestaurants()
            .then(restaurants => res.json(restaurants))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    })
    .post( (req, res) => {
        const { name, neighborhood, address, latlng, photograph, type, hours } = req.body;

        data.addRestaurant(name, neighborhood, address, latlng, photograph, type, hours)
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    });

restaurantRouter.route('/:id')
    .all( (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get( (req, res) => {
        const { id } = req.params;

        data.getRestaurant(id)
            .then(restaurant => res.json(restaurant))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    })
    .put( (req, res) => {
        const { id } = req.params;
        const { name, neighborhood, address, latlng, photograph, type, hours } = req.body;

        data.updateRestaurant(id, name, neighborhood, address, latlng, photograph, type, hours)
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    })
    .delete( (req, res) => {
        const { id } = req.params;

        data.deleteRestaurant(id)
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    });

module.exports = restaurantRouter;