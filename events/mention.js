import {readFileSync} from 'fs';
import dotenv from 'dotenv';
import logger from '../services/logger_service.js';

const conversations = JSON.parse(readFileSync('utils/arof/chat.json'));
dotenv.config();

const preventMentions = ['@here', '@everyone', 'REPLY'];

export default {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    try {
      if (
        message.guild.id === process.env.AKASHIC_SERVER_ID &&
        message.content.includes(`<@${client.user.id}>`)
      ) {
        if (message.author.bot) return false;
        if (preventMentions.includes(message.content)) return false;

        //logger.info(`${message.author.username} mentions Me`);

        // Get responses from chat dataset
        const content = message.content.toLowerCase();

        if (content === `<@${client.user.id}>`) {
          const conversation = conversations.find(
              (conversation) => conversation.option === 'mention',
          );
          const responseLength = conversation.response.length;
          const response =
            conversation.response[Math.floor(Math.random() * responseLength)];

          if (response.includes('Gohan')) {
            const gohanResponse = await message.reply(response);
            const conversation = conversations.find(
                (conversation) => conversation.option === 'mention gohan',
            );
            setTimeout(() => {
              const indexResponse = Math.floor(Math.random() * 2);
              const response = conversation.response[indexResponse];
              gohanResponse.reply(response);
              if (indexResponse === 0) {
                const guild = client.guilds.cache.get(process.env.AKASHIC_SERVER_ID);
                const member = guild.members.cache.get(message.author.id);
                if (!member.roles.cache.has(process.env.AKASHIC_PENGASUH_ROLE_ID)) {
                  member.timeout(60_000);
                }
              }
            }, 3000);
          }
          else {
            return await message.reply(response.replace('USERID', message.author.id));
          }
        } else {
          const conversation = conversations.find((conversation) =>
            conversation.utterance.find((utterance) =>
              content.includes(utterance),
            ),
          );

          if (conversation === undefined) {
            return await message.reply('Maaf, ATRI masih belum mengerti');
          } else if (conversation.hasOwnProperty('option')) {
            if (conversation.option === 'atri birthday') {
              const currentDate = new Date();
              if (currentDate.getMonth() === 7 && currentDate.getDay() === 28) {
                return await message.channel.send(
                    conversation.response.replace('USERID', message.author.id),
                );
              } else {
                return await message.channel.send(
                    'Ini bukan tanggal ulang tahunku...',
                );
              }
            } else if (
              ['morning greeting', 'night greeting'].includes(
                  conversation.option,
              )
            ) {
              const currentUTCDate = new Date();
              const currentDate = new Date(
                  currentUTCDate.toLocaleString('en-US', {
                    timeZone: 'Asia/Jakarta',
                  }),
              );
              if (
                conversation.option === 'morning greeting' &&
                currentDate.getHours() <= 10
              ) {
                if (message.author.id === process.env.REI_ID) {
                  return await message.reply(conversation.response[1]);
                }
                return await message.reply(
                    conversation.response[0].repeat(
                        'USERID', message.author.id,
                    ),
                );
              } else if (
                conversation.option === 'night greeting' &&
                currentDate.getHours() >= 19
              ) {
                if (message.author.id === process.env.REI_ID) {
                  await message.reply(
                      conversation.response[1].message.replace(
                          'REI',
                          message.author.id,
                      ),
                  );
                  return await message.channel.send(
                      conversation.response[1].embed,
                  );
                } else if (message.author.id === process.env.MOON_ID) {
                  await message.reply(
                      conversation.response[2].message.replace(
                          'MOON',
                          message.author.id,
                      ),
                  );
                  return await message.channel.send(
                      conversation.response[2].embed,
                  );
                }
                await message.reply(
                    conversation.response[0].message.replace(
                        'USERID',
                        message.author.id,
                    ),
                );
                return await message.channel.send(
                    conversation.response[0].embed,
                );
              } else {
                const responses = conversations.find((conversation) =>
                  conversation.option === 'invalid greeting').response;

                for (const response of responses) {
                  if (currentDate.getHours() <= response.maxHour) {
                    return await message.reply(
                        response.response.replace('USERID', message.author.id),
                    );
                  }
                }
              }
            }
          } else {
            return await message.reply(conversation.response);
          }
        }
      }
    } catch (err) {
      console.error(err);
      logger.error(err);
    }
  },
};
