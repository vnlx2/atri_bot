/* eslint-disable indent */
// const pool = require('../helpers/database');
import logger from "./logger_service";

const download_link = async (id) => {
    try {
        // Declare Array of Link
        const en_links = [];
        const jp_links = [];

        // Get Data
        const query = `Select * from vn_download_link where code='v${id}' order by provider`;
        let results = await pool.query(query);
        results = Object.values(JSON.parse(JSON.stringify(results)));
        results.forEach((result) => {
            if (result.language === 'EN') {
                en_links.push({
                    provider: result.provider,
                    link: result.link,
                });
            }
            else if (result.language === 'JP') {
                jp_links.push({
                    provider: result.provider,
                    link: result.link,
                });
            }
        });
        return {
            en : en_links,
            jp : jp_links,
        };
    }
    catch (err) {
        console.error(err);
        logger.error(err);
    }
};

module.exports = {
    download_link,
};