import { schedule } from "node-cron";
import logger from "../../logger_service.js";
import axios from "axios";
import { getCoordinate } from "../Jobs/GetRegisteredCity.js";
import { getUsers } from "../Jobs/GetUsers.js";
import { find } from "geo-tz";

// const convertCoordinatToDecimal = (latitude, longitude) => {
//     latitude = latitude.replace(/[^a-zA-Z0-9. ]/g, '').split(" ");
//     longitude = longitude.replace(/[^a-zA-Z0-9. ]/g, '').split(" ");
    
//     let decimalLatitude = parseInt(latitude[0]) + parseInt(latitude[1])/60 
//                             + parseFloat(latitude[2])/3600;
//     let decimalLongitude = parseInt(longitude[0]) + parseInt(longitude[1])/60 
//     + parseFloat(longitude[2])/3600;

//     if (latitude[3] === 'S') {
//         decimalLatitude *= -1;
//     }
//     if (longitude[3] === 'W') {
//         decimalLongitude *= -1;
//     }
//     return [decimalLatitude, decimalLongitude];
// }

const getTimeZoneBasedOnCoordinate = (latitude, longitude) => {
    const timeZone = find(latitude, longitude);
    return timeZone[0];
}

const changeTimezone = (date, timeZone) => {
    if (typeof date === 'string') {
        return new Date(
            new Date(date).toLocaleString('en-US', {
                timeZone,
            }),
        );
    }

    return new Date(
        date.toLocaleString('en-US', {
            timeZone,
        }),
    );
}

const checkIsRamadhan = async () => {
    try {
        const response = await axios.get(
            `https://api.moonchild.my.id/adzan?lat=15.2&lng=98.5`
        );
        const lastDate = response.data.data;
        return lastDate['hijrDate'].includes('Ramadhan')
    } catch (err) {
        throw err;
    }
}

const check = async (client) => {
    const isRamadhan = await checkIsRamadhan();
    if (isRamadhan) {
        const locations = await getCoordinate();
        for (let location of locations) {
            try {
                const response = await axios.get(
                    `https://api.moonchild.my.id/adzan?lat=${location.latitude}&lng=${location.longitude}`
                );
                const tz = getTimeZoneBasedOnCoordinate(location.latitude, location.longitude);
                const currentDate = changeTimezone(new Date(), tz);
                const currentHour = String(currentDate.getHours()).padStart(2, '0');
                const currentMinute = String(currentDate.getMinutes()).padStart(2, '0');
                if (response.data.data['imsak'] === `${currentHour}:${currentMinute}`) {
                    await sendNotify(client, location._id, 'imsak');
                }
                else if (response.data.data['magrib'] === `${currentHour}:${currentMinute}`) {
                    await sendNotify(client, location._id, 'maghrib');
                }
            } catch (err) {
                console.error(err.response.data)
            }
        }
    }
}

const sendNotify = async (client, userId, status="imsak") => {
    try {
        const member = await client.users.fetch(userId);
        const message = {
            'imsak': 'Saatnya Imsyak',
            'maghrib': 'Saatnya berbuka puasa loh....'
        }
        console.log(status);
        await member.send(`Woyyyy... ${message[status]}`);
    } catch (err) {
        throw err;
    }
}

const initialized = async (client) => {
    try {
        console.info('Initializing Imsakiyah Scheduler');
        const locations = await getCoordinate();
        schedule('0 * * * * *', async () => await check(client), {
            scheduled: true,
            timezone: "Asia/Jakarta"
        });
    } catch (err) {
        console.error('An error has occured in Imsakiyah Scheduler Initializer.');
        console.error(err);
    }
}

export default initialized;