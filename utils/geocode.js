const request = require('request');

const geocode = (address, callback) => {
    const access_token = process.env.MAPBOX_API_KEY;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;

    request({ url, json: true, qs: { access_token, limit: 1 } }, (err, res) => {
        if (err) {
            callback('Error connecting to Mapbox.');
        } else if (!res.body.features || !res.body.features.length) {
            callback('Location not found.');
        } else {
            const { center: [longitude, latitude], place_name: placeName } = res.body.features[0];
            callback(undefined, { longitude, latitude, placeName });
        }
    });
};

module.exports = { geocode };
