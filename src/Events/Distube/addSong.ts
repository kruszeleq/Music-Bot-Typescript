import { Events, Queue, Song } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event.js";
import { Metadata } from "../../Structures/Classes/client.js";
import { EmbedBuilder } from "discord.js";
import { color } from "../../Structures/Appearance/colors.js";
const addSong: Event = {
  name: Events.ADD_SONG,
  type: "distube",
  execute: (queue: Queue, song: Song<Metadata>) => {
    song.metadata.interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(
            `Dodano **[${song.name}](${song.url})** - \`${song.formattedDuration}\` przez ${song.user}`
          )
          .setTimestamp()
          .setThumbnail(`${song.thumbnail}`),
      ],
    });
  },
};

export default addSong;
