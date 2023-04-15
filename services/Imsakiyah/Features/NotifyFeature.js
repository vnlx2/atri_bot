import { schedule } from "node-cron";
import logger from "../../logger_service.js";
import axios from "axios";
import { getRegisteredCity } from "../Jobs/GetRegisteredCity.js";
import { getUsers } from "../Jobs/GetUsers.js";

const dateToDateFormat = (date) => {
    const obj = date.split(/\//);
    return `${obj[1]}/${obj[0]}/${obj[2]}`;
};

const getLastRamadhan = async () => {
    try {
        const response = await axios.get(
            `https://imsakiyah-api.santrikoding.com/imsyakiyah?state=%252F3sM%252BuQyYUEpEKzZXZ7E5w7WPYs5rhjiD%252FVDOKmW5jF0KTSu%252FP17rwFivdZ5VsHOSgA2dxJ58urghNHh6ws4%252Fg%253D%253D&city=olAysN1cp2K04GGlRjj15%252FyHQv0s9SdpoqBQ%252FqT%252BfLtOyLqs%252B%252FB828lfys1w5Ua%252B3yXhE8Mu7Vp3ux%252FEDSlXVw%253D%253D&year=2023`
        );
        const lastDate = response.data.data[response.data.data.length - 1].date;
        return Date.parse(
            dateToDateFormat(
                lastDate.slice(lastDate.length - 10)
            )
        );
    } catch (err) {
        throw err;
    }
}

const check = async (client, lastRamadhan) => {
    const currentDate = new Date();
    if (lastRamadhan > currentDate) {
        const cities = await getRegisteredCity();
        for (let city of cities) {
            const response = await axios.get(
                `https://imsakiyah-api.santrikoding.com/imsyakiyah?state=${encodeURI(city.provinceId)}&city=${encodeURI(city._id)}&year=${currentDate.getFullYear()}&date=${currentDate.toISOString().split('T')[0]}`
            );
            const currentHour = String(currentDate.getHours()).padStart(2, '0');
            const currentMinute = String(currentDate.getMinutes()).padStart(2, '0');
            if (response.data.data[0].imsak === `${currentHour}:${currentMinute}`) {
                await sendNotify(client, city._id, 'imsak');
            }
            else if (response.data.data[0].maghrib === `${currentHour}:${currentMinute}`) {
                await sendNotify(client, city._id, 'maghrib');
            }
        }
    }    
}

const sendNotify = async (client, cityId, status="imsak") => {
    try {
        const users = await getUsers(cityId);
        for (let user of users) {
            const member = await client.users.fetch(user._id);
            const message = {
                'imsak': 'Saatnya Imsyak',
                'maghrib': 'Saatnya berbuka puasa loh....'
            }
            console.log(message[status]);
            await member.send(`Woyyyy... ${message[status]}`);
        }
    } catch (err) {
        throw err;
    }
}

const initialized = async (client) => {
    try {
        console.info('Initializing Imsakiyah Scheduler');
        const lastRamadhan = await getLastRamadhan();
        schedule('0 * * * * *', async () => await check(client, lastRamadhan), {
            scheduled: true,
            timezone: "Asia/Jakarta"
        });
    } catch (err) {
        console.error('An error has occured in Imsakiyah Scheduler Initializer.');
        console.error(err);
        logger.error(err);
    }
}

export default initialized;