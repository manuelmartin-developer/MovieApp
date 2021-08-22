const mongoose = require('../utils/db');
const connection = mongoose.createConnection(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });


const movieSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Year: {
        type: String,
        required: true
    },
    Director: {
        type: String,
        required: true
    },
    Poster: {
        type: String
    },
    Plot: {
        type: String
    }
});


module.exports = mongoose.model('Movie', movieSchema, 'Movies');