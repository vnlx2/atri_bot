export default function (results, page) {
    try {
        let items = [];
		let searchResultsString = '';
		let index = 1;
		for (const item of results) {
			searchResultsString += `${index + (5 * (page - 1))}. \`${item.code}\` - ${item.title}\n`;
			items.push(
				{
					label: (item.title.length > 100) ? item.title.substring(0, 97) + '...' : item.title,
					value: `${item.code}`,
				},
			);
			index++;
		}

        return {
            resultString: searchResultsString,
            options: items
        };
    } catch (err) {
        throw err;
    }
}