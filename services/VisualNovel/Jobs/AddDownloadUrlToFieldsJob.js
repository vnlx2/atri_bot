export default function (fields, downloadUrls) {
    try {
        fields.push({ name: '\u200B', value: '**Download Link**' });

    // Add Hyperlinks
    const languages = { 'JP': downloadUrls.jp_link, 'EN': downloadUrls.en_link, 'ID': downloadUrls.id_link };
    for (const [language, urls] of Object.entries(languages)) {
        let links = '';
        let providers = {};
        for (const url of urls) {
            if (providers[url.provider] === undefined) {
                providers[url.provider] = 1;
            }
            else {
                providers[url.provider] += 1;
            }
            links += `[${url.provider} ${providers[url.provider]}](${url.url}) `;
        }
        if (links) {
            fields.push({ name: language, value: links });
        }
    }
    return fields;
    } catch (err) {
        throw err;
    }
}