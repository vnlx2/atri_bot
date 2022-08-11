/* eslint-disable indent */
/**
 * VNDB Method Controller
 */

const VNDB = require('vndb-api');
const dotenv = require('dotenv');
dotenv.config();

class VndbService {
  constructor(client) {
    this.vndb = new VNDB('atri', {
          minConnection: 1,
          maxConnection: 10,
      });
    this.client = client;
    this.vn_length = [
      'Unknown',
      'Very Short (< 2 hours)',
      'Short (2 - 10 hours)',
      'Medium (10 - 30 hours)',
      'Long (30 - 50 hours)',
      'Very Long (> 50 hours)',
    ];
  }
  async getInfo(id) {
    return this.vndb
      .query('get vn basic,details,stats (id = ' + id + ')')
      .then((res) => {
        res = res.items[0];
        const infoEmbedded = {
          color: 0x5e11d9,
          title: res.title,
          url: `https://vndb.org/v${id}`,
          author: {
            name: 'ATRI Visual Novel Search Engine',
            icon_url: this.client.user.avatarURL(),
          },
          description: res.description,
          thumbnail: {
            url: res.image,
          },
          fields: [
            {
              name: 'Aliases',
              value: (res.aliases === null) ? '-' : res.aliases,
              inline: true,
            },
            {
              name: 'Length',
              value: this.vn_length[res.length],
              inline: true,
            },
            {
              name: 'Rating',
              value: res.rating.toString(),
              inline: true,
            },
          ],
          timestamp: new Date(),
          footer: {
            text: `ATRI Version: ${process.env.VERSION}`,
          },
        };
        return infoEmbedded;
      })
      .catch((ex) => {
        return ex.code;
      })
      .finally(() => {
        this.vndb.destroy();
      });
  }

  async findByTitle(name, page = 1) {
    return this.vndb
      .query('get vn basic (search ~ "' + name + '") { "page": ' + page + ', "results": ' + 5 + ' }')
      .then((res) => {
        let results = '';
        const items = [];
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
              label: `${item.title}`,
              value: `${item.id}`,
            },
          );
        }

        const searchResultEmbedded = {
          color: 0x205bba,
          title: 'Search Results',
          author: {
            name: 'ATRI Visual Novel Search Engine',
            icon_url: this.client.user.avatarURL(),
          },
          description: results,
          timestamp: new Date(),
          footer: {
            text: `ATRI Version: ${process.env.VERSION} | Page ${page}`,
          },
        };
        return {
          next_page: res.more,
          results: searchResultEmbedded,
          items: items,
        };
      })
      .catch((ex) => {
        return ex;
      });
  }

  async clearConnection() {
    this.vndb.destroy();
  }
}

module.exports = VndbService;
