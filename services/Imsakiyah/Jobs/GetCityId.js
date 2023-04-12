import axios from "axios";

export const getCityId = async(provinceId, cityName) => {
    try {
        const cityResponse = await axios.get(
            `https://imsakiyah-api.santrikoding.com/city?state=${encodeURI(provinceId)}`
        );
        const city = cityResponse.data.data.filter(city => city.name === cityName);
        if (city.length > 0) {
            return city[0].id;
        }
    } catch (err) {
        throw err;
    }
}