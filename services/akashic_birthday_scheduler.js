import { schedule } from 'node-cron';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
import logger from './logger_service.js';
import AkashicBirthday from '../models/AkashicBirthday.js';

dotenv.config();

const clearBirthdayRole = async (guild, birthdayUsers) => {
    try 
    {
        for (const userId of birthdayUsers)
        {
            const user = await guild.members.fetch(userId);
            await user.roles.remove(process.env.AKASHIC_BIRTHDAY_ROLE_ID);
        }
        birthdayUsers.clear();
    }
    catch (err)
    {
        throw err;
    }
}

const getBirthdayUsers = async () => {
    try 
    {
        const users = await AkashicBirthday.find({ month: moment().month()+1, day: moment().date() })
        return users;
    }
    catch (err)
    {
        throw err;
    }
}

const setBirthdayUsers = async (user, client, guild, birthdayUsers) => {
    try 
    {
        birthdayUsers.add(user._id);
        const member = await guild.members.fetch(user._id);
        await member.roles.add(process.env.AKASHIC_BIRTHDAY_ROLE_ID);
        await client.channels.cache.get(process.env.AKASHIC_CHANNEL_ID)
            .send(`Waaahhh.... Ada yang dapat Role <@&${process.env.AKASHIC_BIRTHDAY_ROLE_ID}> nih... Happy Birthday, <@${user._id}> 🎉🎉🎉`);
        console.info('Set birthday users success.');
    }
    catch (err)
    {
        throw err;
    }
}

const processBirthday = async (client, guild, birthdayUsers) => {
    try
    {
        console.info('Birthday Schedule Start');
        const users = await getBirthdayUsers();
        if (!users.length) {
            await clearBirthdayRole(guild, birthdayUsers);
            console.info('No one have a birthday today.');
        }
        for (const user of users) {
            await setBirthdayUsers(user, client, guild, birthdayUsers);
        }
        return 0;
    }
    catch (err)
    {
        console.error('An error has occured in Birthday Scheduler Process.');
        console.error(err);
        logger.error(err);
    }
}

const initialized = async (client) => {
    try {
        moment.tz.setDefault("Asia/Jakarta");
        const guild = await client.guilds.cache.get(process.env.AKASHIC_SERVER_ID);
        const birthdayUsers = new Set();
        console.info('Initialized Birthday Schedule');
        console.info(`Current Date is ${moment()}`);
        schedule('0 0 * * *', async () => await processBirthday(client, guild, birthdayUsers));
    }
    catch (err) {
        console.error('An error has occured in Birthday Scheduler Initializer.');
        console.error(err);
        logger.error(err);
    }
}

export default initialized;