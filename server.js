const express = require('express');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const morgan = require('morgan');
const { geocode } = require('./utils/geocode');
const { openWeather } = require('./utils/openweather');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;


const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 1) * 60 * 1000, // default 1 min
    max: process.env.RATE_LIMIT_MAX || 5, // default 5 requests per window
    message: 'Too many requests from this IP, please try again later.'
});


const cache = new NodeCache({ stdTTL: process.env.CACHE_DURATION || 300 }); // default 5 minutes

// Logging Middleware
app.use(morgan(':method :url :status :response-time ms :remote-addr'));


app.use((req, res, next) => {
    const apiKey = req.query.apiKey || req.headers['x-api-key'];
    if (apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid API Key' });
    }
});


app.get('/proxy/weather', limiter, (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(422).json({ error: 'MissingParameter', message: 'Location is required' });
    }

    const cacheKey = `weather:${location}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    geocode(location, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'GeocodeError', message: err });
        }
        const { longitude, latitude } = result;

        openWeather(longitude, latitude, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'WeatherAPIError', message: err });
            }
            cache.set(cacheKey, result);
            res.json(result);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
