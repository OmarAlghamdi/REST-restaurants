# REST Restaurants
Simple REST API for restaurant reviews. 

The API is requires MongoDB as database. If you don't want to use MongoDB, pass 'json' as argument to `app.js` then JSON files will be used instead.

Note that the data and the behavior of the API using the json files is not exactly the same as using database. 

The API supports GET, POST, PUT & DELETE methods. There is no Authentication/Authorization.

## Endpoints
Check the routers inside the folder `./routes` for complete details about the endpoint, url parameter and body parameter of the API.
- `./api/users`
- `./api/restaurants`
- `./api/reviews`

## Configuration
Before you run `app.js`, update MongoDB url (`MONGO_URL`) and database name (`MONGO_DB`) in `config.env`. You will need also to import the data collections from `./data/db` info MongoDB.

Optionally, you can change the port number and the logs file.

## How To Run
- clone the repo.
- Run `npm install`
- Run `npm run start [json]` to run normally. Or run `npm run dev [json]` to run [nodemon](https://www.npmjs.com/package/nodemon) (server restarts automatically when file changes).
- pass 'json' word as an argument if you want to use json files in the `/data` folder as the data source instead on MongoDB
- Use [Postman](https://www.postman.com/) to initiate HTTP request or your favorite tool.

## Data Source
The sample data was taken/generated from: 
- [Users](https://randomuser.me/)
- [Restaurants & Reviews](https://gist.github.com/yoobi55/5d36f13e902a75225a39a8caa5556551)