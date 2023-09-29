export default function (result) {
    try {
        const vn_length = [
            'Unknown',
            'Very Short (< 2 hours)',
            'Short (2 - 10 hours)',
            'Medium (10 - 30 hours)',
            'Long (30 - 50 hours)',
            'Very Long (> 50 hours)',
        ];
        return [
            {
				name: 'Aliases',
				value: (result.aliases === null) ? '-' : result.aliases.join("\r\n"),
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
			}
        ]
    }
    catch (err) {
        throw err;
    }
}