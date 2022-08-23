/* eslint-disable indent */
const embed = (icon_url, title, description, color = 0x5e11d9, url = null, fields = null, thumbnail_url = null) => {
    const embed_data = {
        color: color,
        title: title,
        author: {
            name: 'ATRI Visual Novel Search Engine',
            icon_url: icon_url,
        },
        description: description,
        timestamp: new Date(),
        footer: {
            text: `ATRI Version: ${process.env.VERSION}`,
        },
    };
    if (url != null) embed_data.url = url;
    if (thumbnail_url != null) {
        embed_data.thumbnail = {
            url: thumbnail_url,
        };
    }
    if (fields != null) {
        embed_data.fields = fields;
    }
    embed_data.timestamp = new Date();
    embed_data.footer = {
        text: `ATRI Version: ${process.env.VERSION}`,
    };
    return embed_data;
};

module.exports = {
    embed,
};