const axios = require("axios");

module.exports = async function forwardGeocode(place) {
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: place,
                format: "json",
                limit: 1,
            },
            headers: {
                "User-Agent": "wanderlust-app"
            }
        }
    );

    if (!response.data.length) return null;

    return {
        lat: response.data[0].lat,
        lon: response.data[0].lon
    };
};
