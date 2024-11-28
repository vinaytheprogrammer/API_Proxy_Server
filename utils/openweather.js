const request = require('request');

const openWeather = (longitude, latitude, callback) => {
    const url = 'http://api.openweathermap.org/data/2.5/weather';

    request({
        url,
        json: true,
        qs: {
            lat: latitude,
            lon: longitude,
            units: 'metric',
            appid: process.env.OPENWEATHER_API_KEY
        }
    }, (err, res) => {
        if (err) {
            callback('Error connecting to OpenWeather.');
        } else if (res.body.cod !== 200) {
            callback('Error retrieving weather data.');
        } else {
            callback(undefined, res.body);
        }
    });
};

module.exports = { openWeather };
