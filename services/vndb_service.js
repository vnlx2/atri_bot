/* eslint-disable indent */
/**
 * VNDB Method Controller
 */


import VNDB from '../models/VNDB.js';
import embed_maker from '../helpers/embed.js';
import logger from './logger_service.js';
import dotenv from 'dotenv';
import embed from '../helpers/embed.js';

dotenv.config();

const vn_length = [
  'Unknown',
  'Very Short (< 2 hours)',
  'Short (2 - 10 hours)',
  'Medium (10 - 30 hours)',
  'Long (30 - 50 hours)',
  'Very Long (> 50 hours)',
];

const getInfo = async (client, id) => {
  try {
    const result = await VNDB.findOne({ code: id }).select('-__v -createdAt -updatedAt');
    if (!result) {
      return embed_maker.errorEmbed('Not Found', 'Sorry, we didn\'t find the vn you are looking for, please check the vn id again.', client);
    }
    const fields = [
      {
        name: 'Aliases',
        value: (result.aliases === null) ? '-' : result.aliases,
        inline: true,
      },
      {
        name: 'Length',
        value: (result.length === null) ? '-' : vn_length[result.length],
        inline: true,
      },
      {
        name: 'Rating',
        value: result.rating.toString(),
        inline: true,
      },
    ];
    return embed_maker.embed(client.user.avatarURL, result.title, result.description, 0x5e11d9, `https://vndb.org/v${id}`, fields, result.image);
  }
  catch (err) {
    console.error(err);
    logger.error(err);
  }
};

const findByTitle = async (client, name, page = 1) => {
  try {
    return vndb
      .query('get vn basic (search ~ "' + name + '") { "page": ' + page + ', "results": ' + 5 + ' }')
      .then((res) => {
        let results = '';
        const items = [];
        if (res.items.length === 0) {
          return null;
        }
        else {
          for (let i = 0; i < res.items.length; i++) {
            const item = res.items[i];
            if (i == 0) {
              results += `${i + 1 + (5 * (page - 1))}. \`${item.id}\` - ${item.title}`;
            }
            else {
              results += `\n${i + 1 + (5 * (page - 1))}. \`${item.id}\` - ${item.title}`;
            }
            items.push(
              {
                label: (item.title.length > 100) ? item.title.substring(0, 97) + '...' : item.title,
                value: `${item.id}`,
              },
            );
          }
        }
        return {
          next_page: res.more,
          results: embed_maker.embed(client.user.avatarURL, 'Search Results', results, 0x205bba),
          items: items,
        };
      })
      .catch((ex) => {
        return ex;
      });
  }
  catch (err) {
    console.error(err);
    logger.error(err);
  }
};

const clearConnection = async () => {
  vndb.destroy();
};

export default {
  getInfo,
  findByTitle,
  clearConnection
};
