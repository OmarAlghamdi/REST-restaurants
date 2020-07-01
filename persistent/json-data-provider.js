const fs = require('fs').promises;
const path = require('path');

const idGen = require('../utils').idGen;

class JsonDataProvider {
    #path;
    #users;
    #restaurants;
    #reviews;
    
    /**
     * 
     * @param {String} _path path to the folder containing JSON files
     */
    constructor(_path){
        this.#path = _path;

        // preload josn files
        fs.readFile(path.join(this.#path, 'users.json'))
            .then(data => this.#users = JSON.parse(data))
            .catch(err => console.error(err));

        fs.readFile(path.join(this.#path, 'restaurants.json'))
            .then(data => this.#restaurants = JSON.parse(data))
            .catch(err => console.error(err));

        fs.readFile(path.join(this.#path, 'reviews.json'))
            .then(data => this.#reviews = JSON.parse(data))
            .catch(err => console.error(err));
    }

    /**
     * 
     * @param {String} id user Id
     * @returns {Promise.<Object|String>} user|error message
     */
    getUser(id) {
        return new Promise( (resolve, reject) => {
            if (id < this.#users.length) {
                resolve(this.#users[id]);
            } else {
                reject('User does not exists');
            }
        });
    }

    /**
     * 
     * @returns {Promise.<[Objects]>} array of all users
     */
    getUsers(){
        return new Promise( (resolve, reject) => {
            resolve(this.#users);
        });
    }

    /**
     * 
     * @param {Stromg} email 
     * @param {String} password 
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} phone free format
     * @param {String} gender male or female
     * @param {String} dob YYYY-MM-DD
     * @param {Object} address props: <String> city, state & country
     * @returns {Promise.<Boolean|err>} returns ture if added successfully
     */
    addUser(email, password, firstName, lastName, phone, gender, dob, address) {
        return new Promise( (resolve, reject) => {
            const newUser = {
                uid: idGen(),
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                dob: dob,
                gender: gender,
                photo: '',
                regDate: new Date(Date.now()).toISOString(),
                address: address
            }

            this.#users.push(newUser);

            // commits change to file
            fs.writeFile(path.join(this.#path, 'users.json'), JSON.stringify(this.#users), 'utf8')
                .then( () => resolve(true) )
                .catch( err => reject(err) );
        });
    }

    /**
     * 
     * @param {Number} id array index
     * @param {String} email 
     * @param {String} password 
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} phone free format
     * @param {String} gender male or female
     * @param {String} dob YYYY-MM-DD
     * @param {oBJECT} address props: <String> city, state & country
     * @returns {Promise.<Boolean|err>} returns ture if updated successfully
     */
    updateUser(id, email, password, firstName, lastName, phone, gender, dob, address) {
        return new Promise( (resolve, reject) => {
            if (id < this.#users.length) {
                const updatedUser = {
                    uid: this.#users[id].uid,
                    regDate: this.#users[id].regDate,
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    dob: dob,
                    gender: gender,
                    photo: '',
                    address: address
                }

                this.#users[id] = updatedUser;

                // commits change to file
                fs.writeFile(path.join(this.#path, 'users.json'), JSON.stringify(this.#users), 'utf8')
                    .then( () => resolve(true) )
                    .catch( err => reject(err) );
            
            } else {
                reject('User does not exists');
            }
        })
    }

    /**
     * 
     * @param {Number} id array index
     * @returns {Promise.<Boolean|err>} returns ture if deleted successfully
     */
    deleteUser(id){
        return new Promise( (resolve, reject) => {
            if (id < this.#users.length){
                this.#users.splice(id, 1);

                // commits change to file
                fs.writeFile(path.join(this.#path, 'users.json'), JSON.stringify(this.#users), 'utf8')
                    .then( () => resolve(true) )
                    .catch( err => reject(err) );
            } else {
                reject('User does not exists');
            }
        })
    }

    /**
     * 
     * @param {Number} id 
     * @returns {Promise.<Object|String>} restaurant|error message
     */
    getRestaurant(id) {
        return new Promise( (resolve, reject) => {
            if (id < this.#restaurants.length) {
                resolve(this.#restaurants[id]);
            } else {
                reject('Restaurant does not exists');
            }
        });
    }

    /**
     * @returns {Promise.<[Object]>} array of all restaurants
     */
    getRestaurants(){
        return new Promise( (resolve, reject) => {
            resolve(this.#restaurants);
        });
    }

    /**
     * 
     * @param {String} name 
     * @param {String} neighborhood neighborhood name
     * @param {String} address building street city state zipcode
     * @param {Object} latlng props: <Number> lat & lng
     * @param {String} photograph link
     * @param {String} type cuisine type
     * @param {Object} hours opening hours. props: <String> Monday~Sunday. example: 5:30 pm - 11:00 pm
     * @returns {Promise.<Boolean|err>} returns ture if added successfully
     */
    addRestaurant(name, neighborhood, address, latlng, photograph, type, hours) {
        return new Promise( (resolve, reject) => {
            const newRestaurant = {
                id: this.#restaurants.length +1,
                name: name,
                neighborhood: neighborhood,
                address: address,
                latlng: latlng,
                photograph: photograph,
                cuisine_type: type,
                operating_hours: hours
            }

            this.#restaurants.push(newRestaurant);

            // commits change to file
            fs.writeFile(path.join(this.#path, 'restaurants.json'), JSON.stringify(this.#restaurants), 'utf8')
                .then( () => resolve(true) )
                .catch( err => reject(err) );
        });
    }

    /**
     * @param {Number} id array index
     * @param {String} name 
     * @param {String} neighborhood neighborhood name
     * @param {String} address building street city state zipcode
     * @param {Object} latlng props: <Number> lat & lng
     * @param {String} photograph link
     * @param {String} type cuisine type
     * @param {Object} hours opening hours. props: <String> Monday~Sunday. example: 5:30 pm - 11:00 pm
     * @returns {Promise.<Boolean|err>} returns ture if updated successfully
     */
    updateRestaurant(id, name, neighborhood, address, latlng, photograph, type, hours) {
        return new Promise( (resolve, reject) => {
            if (id < this.#restaurants.length) {
                const updatedRestaurant = {
                    id: this.#restaurants[id].id,
                    name: name,
                    neighborhood: neighborhood,
                    address: address,
                    latlng: latlng,
                    photograph: photograph,
                    cuisine_type: type,
                    operating_hoursder: hours
                }

                this.#restaurants[id] = updatedRestaurant;

                fs.writeFile(path.join(this.#path, 'restaurants.json'), JSON.stringify(this.#restaurants), 'utf8')
                    .then( () => resolve(true) )
                    .catch( err => reject(err) );
            } else {
                reject('Restaurant does not exists');
            }
        })
    }

    /**
     * 
     * @param {Number} id array index
     * @returns {Promise.<Boolean|err>} returns ture if deleted successfully
     */
    deleteRestaurant(id){
        return new Promise( (resolve, reject) => {
            if (id < this.#restaurants.length){
                this.#restaurants.splice(id, 1);
                
                // commits change to file
                fs.writeFile(path.join(this.#path, 'restaurants.json'), JSON.stringify(this.#restaurants), 'utf8')
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            } else {
                reject('Restaurant does not exists');
            }
        })
    }

    /**
     * 
     * @param {Number} restaurant_id restaurant Id
     * @param {Number} id array indes
     * @returns {Promise.<Object|String>} review|error message
     */
    getReview(restaurant_id, id) {
        return new Promise( (resolve, reject) => {
            if (id < this.#reviews.length) {
                const review = this.#reviews[id];
                if (review.restaurant == restaurant_id){
                    resolve(this.#reviews[id]);
                } else {
                    reject('Review does not exists');
                }
                
            } else {
                reject('Review does not exists');
            }
        });
    }

    /**
     * 
     * @param {Number} restaurant_id restaurant Id
     * @returns {Promise.<[Object]>} array of restaurant's reviews
     */
    getReviews(restaurant_id){
        return new Promise( (resolve, reject) => {
            resolve(this.#reviews.filter(review => review.restaurant == restaurant_id));
        });
    }

    /**
     * 
     * @param {Number} restaurant restaurant Id
     * @param {String} user user Id
     * @param {Number} rating 1~5
     * @param {String} comments review
     * @returns {Promise.<Boolean|err>} returns ture if added successfully
     */
    addReview(restaurant, user, rating, comments) {
        return new Promise( (resolve, reject) => {
            const newReview = {
                restaurant: restaurant,
                user: user,
                rating: rating,
                comments: comments
            }

            this.#reviews.push(newReview);

            // commits change to file
            fs.writeFile(path.join(this.#path, 'reviews.json'), JSON.stringify(this.#reviews), 'utf8')
                .then( () => resolve(true) )
                .catch( err => reject(err) );
        });
    }

    /**
     * 
     * @param {Number} id array index
     * @param {Number} restaurant restaurant Id
     * @param {String} user user Id
     * @param {Number} rating 1~5
     * @param {String} comments review
     * @returns {Promise.<Boolean|err>} returns ture if updated successfully
     */
    updateReview(id, restaurant, user, rating, comments) {
        return new Promise( (resolve, reject) => {
            if (id < this.#reviews.length) {
                const updatedReview = {
                    restaurant: restaurant,
                    user: user,
                    rating: rating,
                    comments: comments,
                }

                this.#reviews[id] = updatedReview;

                // commits change to file
                fs.writeFile(path.join(this.#path, 'reviews.json'), JSON.stringify(this.#reviews), 'utf8')
                    .then( () => resolve(true) )
                    .catch( err => reject(err) );
            } else {
                reject('Review does not exists');
            }
        })
    }

    /**
     * 
     * @param {Number} id array index
     * @returns {Promise.<Boolean|err>} returns ture if deleted successfully
     */
    deleteReview(id){
        return new Promise( (resolve, reject) => {
            if (id < this.#reviews.length){
                this.#reviews.splice(id, 1);
                fs.writeFile(path.join(this.#path, 'reviews.json'), JSON.stringify(this.#reviews), 'utf8')
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            } else {
                reject('Review does not exists');
            }
        })
    }
}



module.exports = JsonDataProvider;