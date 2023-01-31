import { ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord.js";

const buttonStyle = {
    'primary': ButtonStyle.Primary,
    'secondary': ButtonStyle.Secondary,
    'success': ButtonStyle.Success,
    'danger': ButtonStyle.Danger,
    'link': ButtonStyle.Link
}

export default function (id, label, style = 'primary', emoji = {}, url = null, disable = false) {
    return new ButtonBuilder({
        'custom_id': id,
        'label': label,
        'style': buttonStyle[style],
        'disabled': disable,
        'emoji': emoji,
        'url': url
    });
}