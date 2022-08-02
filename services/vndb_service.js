/* eslint-disable indent */
/**
 * VNDB Method Controller
 */

const VNDB = require('vndb-api');

class VndbService {
  constructor(client) {
    this.vndb = new VNDB('atri', {
          minConnection: 1,
          maxConnection: 10,
      });
    this.client = client;
    this.vn_length = {
      3: 'Fast',
      4: 'Medium',
      5: 'Slow',
    };
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
              value: res.aliases,
              inline: true,
            },
            {
              name: 'Length',
              value: this.getPlayerTime(res.length),
              inline: true,
            },
            {
              name: 'Rating',
              value: res.rating.toString(),
              inline: true,
            },
            {
              name: 'Popularity',
              value: res.popularity.toString(),
              inline: true,
            },
          ],
          timestamp: new Date(),
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

  findByName(name) {
    this.vndb
      .query('get vn basic (search ~ "' + name + '")')
      .then((res) => {
        console.log([res.num, res.items]);
        return [res.num, res.items];
      })
      .catch((ex) => {
        console.log(ex.msg);
        return ex.msg;
      })
      .finally(() => {
        this.vndb.destroy();
      });
  }

  getPlayerTime(idx) {
    if (idx == 3) return 'Fast';
    else if (idx == 4) return 'Medium';
    else if (idx == 5) return 'Slow';
  }
}

module.exports = VndbService;
