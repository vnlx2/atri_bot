/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
const pool = require('../helpers/database');
const schedule = require('node-schedule');
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();

class AkashicBirthday {
    constructor() {
        this.ceplok_telur = ['517713906492243993'];
    }

    clear_special_role(guild, role) {
        this.ceplok_telur.forEach((uid) => {
            guild.members.fetch(uid)
                .then((member) => {
                    member.roles.remove(role);
                });
        });
        this.ceplok_telur = [];
    }

    set_schedule(client) {
        const guild = client.guilds.cache.get(process.env.AKASHIC_SERVER_ID);
        const role = guild.roles.cache.get(process.env.AKASHIC_BIRTHDAY_ROLE_ID);
        console.info('Initialized Birthday Schedule');
        return schedule.scheduleJob('0 0 * * *', async () => {
            console.info('Birthday Schedule Start');
            const query = `select * from birthday_akashic where birth_date="${moment(new Date()).format('YYYY-MM-DD')}"`;
            await pool.query(query)
                .then((results) => {
                    results = Object.values(JSON.parse(JSON.stringify(results)));
                    if (results.length === 0) {
                        this.clear_special_role(guild, role);
                    }
                    else {
                        results.forEach((result) => {
                            this.ceplok_telur.push(result.uid);
                            guild.members.fetch(result.uid)
                                .then((member) => {
                                    member.roles.add(role);
                                    client.channels.cache.get(process.env.AKASHIC_CHANNEL_ID).send(`Waaahhh.... Ada yang dapat Role <@&${process.env.AKASHIC_BIRTHDAY_ROLE_ID}> nih... Happy Birthday, <@${result.uid}> 🎉🎉🎉`);
                                });
                        });
                    }
            });
        });
    }
}

module.exports = new AkashicBirthday;