const mongoose = require('mongoose');

// TODO: document functions
// TODO: return the right promises
// TODO: update API design
class MongoDataProvider {
    /**
     * 
     * @param {String} url MongoDB url
     * @param {String} dbName  database name
     */
    constructor(url, dbName) {
        // connect to the database
        this.connection = mongoose.connect(`${url}/${dbName}`)
            .then(db => this.db = db)
            .catch(err => console.error(err));

        // init models
        const [ userSchema, reviewSchema, restaurantSchema ] = this.createSchemas();
        this.User = mongoose.model('user', userSchema);
        this.Review = mongoose.model('review', reviewSchema);
        this.Restaurant = mongoose.model('restaurant', restaurantSchema);
        
    }

    // TODO: enforce format and ranges
    // TODO: correct types
    createSchemas() {
        const userSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true, lowercase: true, trim: true, 
                validate: {
                    validator: function (v) {
                        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                }   }
            },
            password:   { type: String, required: true },
            firstName:  { type: String, required: true },
            lastName:   { type: String, required: true },
            phone:      { type: String, required: true },
            dob:        { type: String, required: true },
            gender:     { type: String, required: true },
            photo:      { type: String },
            regDate:    { type: String, required: true },
            address: { type: {
                        city:       { type: String, required: true },
                        state:      { type: String, required: true },
                        country:    { type: String, required: true }
                    } }
        });

        const reviewSchema = new mongoose.Schema({
            restaurant: { type: String, required: true },
            user:       { type: String, required: true },
            date:       { type: String, required: true },
            rating:     { type: Number, required: true,  min: 1, max: 5},
            comments:   { type: String, required: true },
        });

        const restaurantSchema = new mongoose.Schema({
            name:           { type: String, required: true },
            neighborhood:   { type: String, required: true },
            address:        { type: String, required: true },
            cuisine_type:   { type: String, required: true },
            address: { type: {
                lat:    { type: Number, required: true },
                lng:    { type: Number, required: true },
            } },
            operating_hours: { type: {
                Monday:     { type: String },
                Tuesday:    { type: String },
                Wednesday:  { type: String },
                Thursday:   { type: String },
                Friday:     { type: String },
                Saturday:   { type: String },
                Sunday:     { type: String }
            } }
        });

        return [userSchema, reviewSchema, restaurantSchema];
    }

    /**
     * 
     * @param {String} id user Id
     * @returns {Promise.<Object|String>} user|error message
     */
    getUser(id) {
        return new Promise( (resolve, reject) => {
            this.User.findById(id, '-password -regDate', (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        });
    }

    /**
     * 
     * @returns {Promise.<[Objects]>} array of all users
     */
    getUsers(){
        return new Promise( (resolve, reject ) => {
            this.User.find({}, '-password -regDate', (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    /**
     * 
     * @param {String} email 
     * @param {String} password 
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} phone free format
     * @param {String} gender male or female
     * @param {String} dob YYYY-MM-DD
     * @param {Object} address props: <String> city, state & country
     * @returns {Promise.<Boolean|err>} returns true if added successfully
     */
    addUser(email, password, firstName, lastName, phone, gender, dob, address) {
        return this.User.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            dob: dob,
            gender: gender,
            regDate: new Date(Date.now()).toISOString(),
            address: address
        })
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
     * @returns {Promise.<Boolean|err>} returns true if updated successfully
     */
    updateUser(id, email, password, firstName, lastName, phone, gender, dob, address) {
        return this.User.updateOne({ _id: id }, {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            address: address
        }, { omitUndefined: true })
            .exec();
    }
    
    /**
     * 
     * @param {Number} id array index
     * @returns {Promise.<Boolean|err>} returns true if deleted successfully
     */
    deleteUser(id){
        return new Promise( (resolve, reject) => {
            this.User.deleteOne({_id: id}, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    /**
     * 
     * @param {Number} id 
     * @returns {Promise.<Object|String>} restaurant|error message
     */
    getRestaurant(id) {
        return new Promise( (resolve, reject) => {
            this.Restaurant.findById(id, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        });
    }

    /**
     * @returns {Promise.<[Object]>} array of all restaurants
     */
    getRestaurants(){
        return new Promise( (resolve, reject) => {
            this.Restaurant.find({},  (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
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
     * @returns {Promise.<Boolean|err>} returns true if added successfully
     */
    addRestaurant(name, neighborhood, address, latlng, photograph, type, hours) {
        return this.Restaurant.create({
            name: name,
            neighborhood: neighborhood,
            address: address,
            latlng: latlng,
            photograph: photograph,
            cuisine_type: type,
            operating_hours: hours
        })
        
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
     * @returns {Promise.<Boolean|err>} returns true if updated successfully
     */
    updateRestaurant(id, name, neighborhood, address, latlng, photograph, type, hours) {
        return this.Restaurant.updateOne({ _id: id }, {
            name: name,
            neighborhood: neighborhood,
            address: address,
            latlng: latlng,
            photograph: photograph,
            cuisine_type: type,
            operating_hours: hours
        }, {omitUndefined: true})
            .exec();
    }

    /**
     * 
     * @param {Number} id array index
     * @returns {Promise.<Boolean|err>} returns true if deleted successfully
     */
    deleteRestaurant(id){
        return new Promise( (resolve, reject) => {
            this.Restaurant.deleteOne({_id: id}, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            })
        })
    }

    /**
     * 
     * @param {Number} restaurant_id restaurant Id
     * @param {Number} id array index
     * @returns {Promise.<Object|String>} review|error message
     */
    getReview(restaurant_id, id) {
        return new Promise( (resolve, reject) => {
            if (id < this.reviews.length) {
                const review = this.reviews[id];
                if (review.restaurant == restaurant_id){
                    resolve(this.reviews[id]);
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
            this.Review.find({restaurant: restaurant_id}, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        });
    }

    /**
     * 
     * @param {Number} restaurant restaurant Id
     * @param {String} user user Id
     * @param {Number} rating 1~5
     * @param {String} comments review
     * @returns {Promise.<Boolean|err>} returns true if added successfully
     */
    addReview(restaurant, user, rating, comments) {
        return this.Review.create({
            restaurant: restaurant,
            user: user,
            date: new Date(Date.now()).toISOString(),
            rating: rating,
            comments: comments
        })
    }

    /**
     * 
     * @param {Number} id array index
     * @param {Number} restaurant restaurant Id
     * @param {String} user user Id
     * @param {Number} rating 1~5
     * @param {String} comments review
     * @returns {Promise.<Boolean|err>} returns true if updated successfully
     */
    updateReview(id, restaurant, user, rating, comments) {
        return this.Review.updateOne({ _id: id }, {
            rating: rating,
            comments: comments,
        }, {omitUndefined: true })
            .exec();
        
    }

    /**
     * 
     * @param {Number} id array index
     * @returns {Promise.<Boolean|err>} returns true if deleted successfully
     */
    deleteReview(id){
        return new Promise( (resolve, reject) => {
            this.Review.deleteOne({_id: id}, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            })
        })
    }
}

module.exports = MongoDataProvider;