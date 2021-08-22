const fetch = require('node-fetch');
const User = require('../models/users_model');
const Movies = require('../models/movie_model');

const APImovies = {
    getMovies: async (title) => {

        const res = await fetch(`https://www.omdbapi.com/?s=${title}&type=movie&apikey=${process.env.MOVIE_API_KEY}`);
        const films = await res.json();
        const length = films.totalResults;
        if (length > 10) {

            const pages = Math.trunc(Number(films.totalResults) / 10);
            const result = [];
            for (let i = 1; i <= pages; i++) {
                const res = await fetch(`https://www.omdbapi.com/?s=${title}&page=${i}&type=movie&apikey=${process.env.MOVIE_API_KEY}`);
                const json = await res.json();
                result.push(json);
            }
            return result;
        } else {
            return films;
        }
    },
    getOneMovie: async (title) => {
        const res = await fetch(`https://www.omdbapi.com/?t=${title}&type=movie&plot=full&apikey=${process.env.MOVIE_API_KEY}`);
        const film = await res.json();
        if (!film.Error) {
            return film;
        } else {
            const moviesdb = await Movies.findOne({
                Title: title
            });
            return moviesdb
        }
    }
}

module.exports = APImovies;