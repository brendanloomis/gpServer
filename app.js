const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('common'));
app.use(cors());

const apps = require('./playstore');

app.get('/apps', (req, res) => {
    const { sort, genres } = req.query;

    if (sort) {
        if (!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send('sort must be one of Rating or App');
        }
    }

    if (genres) {
        if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            return res 
                .status(400)
                .send('genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card');
        }
    }

    let results = apps;

    if (sort === 'App') {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }

    if (sort === 'Rating') {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? -1 : a[sort] < b[sort] ? 1 : 0;
        });
    }
       
    if (genres) {
        results = results.filter(app => app.Genres.includes(genres));
    }

    res.json(results);
});

module.exports = app;