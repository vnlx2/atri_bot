import axios from 'axios';
import provinces from '../utils/imsakiyahDB/id/provinces.json' assert { type: "json" };

let cities = "";

export const autocompleteProvince = async (interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    const focusedValue = interaction.options.getFocused().toUpperCase();
    if (focusedOption.name === 'province') {
        cities = "";
        const filtered = provinces.filter(province => province.name.startsWith(focusedValue));
        return await interaction.respond(
            filtered.slice(0, 25).map(province => ({ name: province.name, value: province.name })),
        );
    }
    else if (focusedOption.name === 'city') {
        const provinceId = provinces.filter(province => province.name === interaction.options.getString('province'))[0].id;
        if (cities === "") {
            const response = await axios.get(
                `https://imsakiyah-api.santrikoding.com/city?state=${encodeURI(provinceId)}`
            );
            cities = response.data.data;
        }
        const filtered =  cities.filter(city => (focusedValue === '') ? city.name.startsWith(focusedValue) : city.name.includes(focusedValue));
        return await interaction.respond(
            filtered.slice(0, 25).map(city => ({ name: city.name, value: city.name })),
        );
    }
}