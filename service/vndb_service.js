/* eslint-disable indent */
/**
 * VNDB Method Controller
 */

class VndbService {
  constructor(vndb) {
    this.vndb = vndb;
  }
  getInfo(id) {
    this.vndb
      .query('get vn basic,details (id = ' + id + ')')
      .then((res) => {
        return res;
      })
      .catch((ex) => {
        return ex.code;
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
}

module.exports = VndbService;

// exports.getInfo = function (vndb, id) {
// vndb.query(`get vn basic,detail (id = ${id})`)
//     .then(res => {
//         return (response);
//     })
//     .catch(ex => {
//         return ex.code;
//     })
//     .finally(() => {
//         vndb.destroy();
//     })
// };
