const fs = require('fs').promises;
const path = require('path');

const idGen = require('../utils').idGen;

class JsonDataProvider {
    #path;
    #users;
    #restaurants;
    #reviews;
    constructor(arg){
        this.#path = arg;

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

    getUser(id) {
        return new Promise( (resolve, reject) => {
            if (id < this.#users.length) {
                resolve(this.#users[id]);
            } else {
                reject('User does not exists');
            }
        });
    }

    getUsers(){
        return new Promise( (resolve, reject) => {
            resolve(this.#users);
        });
    }

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

            fs.writeFile(path.join(this.#path, 'users.json'), JSON.stringify(this.#users), 'utf8')
                .then( () => resolve(true) )
                .catch( err => reject(err) );
        });
    }

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

                fs.writeFile(path.join(this.#path, 'users.json'), JSON.stringify(this.#users), 'utf8')
                    .then( () => resolve(true) )
                    .catch( err => reject(err) );
            } else {
                reject('User does not exists');
            }
        })
    }

    deleteUser(id){
        return new Promise( (resolve, reject) => {
            if (id < this.#users.length){
                this.#users.splice(id, 1);
                fs.writeFile(path.join(this.#path, 'users.json'), JSON.stringify(this.#users), 'utf8')
                    .then( () => resolve(true) )
                    .catch( err => reject(err) );
            } else {
                reject('User does not exists');
            }
        })
    }

    getRestaurant(id) {
        return new Promise( (resolve, reject) => {
            if (id < this.#restaurants.length) {
                resolve(this.#restaurants[id]);
            } else {
                reject('Restaurant does not exists');
            }
        });
    }

    getRestaurants(){
        return new Promise( (resolve, reject) => {
            resolve(this.#restaurants);
        });
    }

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

            fs.writeFile(path.join(this.#path, 'restaurants.json'), JSON.stringify(this.#restaurants), 'utf8')
                .then( () => resolve(true) )
                .catch( err => reject(err) );
        });
    }

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
                    genoperating_hoursder: hours
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

    deleteRestaurant(id){
        return new Promise( (resolve, reject) => {
            if (id < this.#restaurants.length){
                this.#restaurants.splice(id, 1);
                fs.writeFile(path.join(this.#path, 'restaurants.json'), JSON.stringify(this.#restaurants), 'utf8')
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            } else {
                reject('Restaurant does not exists');
            }
        })
    }

    getReview(restaurant_id, id) {
        return new Promise( (resolve, reject) => {
            if (id < this.#reviews.length) {
                
                resolve(this.#reviews[id]);
            } else {
                reject('Review does not exists');
            }
        });
    }

    getReviews(restaurant_id){
        return new Promise( (resolve, reject) => {
            resolve(this.#reviews.filter(review => review.restaurant == restaurant_id));
        });
    }

    addReview(restaurant, user, rating, comments) {
        return new Promise( (resolve, reject) => {
            const newReview = {
                restaurant: restaurant,
                user: user,
                rating: rating,
                comments: comments
            }

            this.#reviews.push(newReview);

            fs.writeFile(path.join(this.#path, 'reviews.json'), JSON.stringify(this.#reviews), 'utf8')
                .then( () => resolve(true) )
                .catch( err => reject(err) );
        });
    }

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

                fs.writeFile(path.join(this.#path, 'reviews.json'), JSON.stringify(this.#reviews), 'utf8')
                    .then( () => resolve(true) )
                    .catch( err => reject(err) );
            } else {
                reject('Review does not exists');
            }
        })
    }

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