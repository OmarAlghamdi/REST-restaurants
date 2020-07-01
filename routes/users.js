const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const DataProvider = require('../persistent/json-data-provider');

const data = new DataProvider(path.resolve('./data'));

const userRouter = express.Router();
userRouter.use(bodyParser.json());

/**
 * PATH:    /api/users
 * METHODS:
 *      GET:    returns all users
 *      POST:   body-args: email, password, firstName, lastName, phone, gender,
 *              dob, address
 */
userRouter.route('/')
    .all( (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get( (req, res) => {
        data.getUsers()
            .then(usres => res.json(usres))
            .catch(err => console.error(err));
    })
    .post( (req, res) => {
        const { email, password, firstName, lastName, phone, gender, dob, address } = req.body;

        data.addUser(email, password, firstName, lastName, phone, gender, dob, address)
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    });

/**
 * PATH:    /api/users
 * PARAMS:  <Number>    user index
 * METHODS:
 *      GET:    returns a paricular user
 *      PUT:    body-args: email, password, firstName, lastName, phone, gender,
 *              dob, address
 *      DELETE: 
 */
userRouter.route('/:id')
    .all( (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get( (req, res) => {
        const { id } = req.params;

        data.getUser(id)
            .then(user => res.json(user))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    })
    .put( (req, res) => {
        const { id } = req.params;
        const { email, password, firstName, lastName, phone, gender, dob, address } = req.body;

        data.updateUser(id, email, password, firstName, lastName, phone, gender, dob, address)
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            });
    })
    .delete( (req, res) => {
        const { id } = req.params;

        data.deleteUser(id)
            .then(res.sendStatus(200))
            .catch(err => {
                res.statusCode = 404;
                res.end(err.toString());
            })
    });

module.exports = userRouter;