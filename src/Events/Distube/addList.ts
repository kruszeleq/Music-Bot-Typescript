import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import type { Playlist, Queue } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event.js";
import { Metadata } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/index.js";

const addList: Event = {
  name: Events.ADD_LIST,
  type: "distube",
  execute: (queue: Queue, playlist: Playlist<Metadata>) => {
    playlist.metadata.interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(
            `Dodano **[${playlist.name}](${playlist.url})** - \`${playlist.songs.length}\` do kolejki \n-# *Dodał:** ${playlist.user}`
          )
          .setThumbnail(`${playlist.thumbnail}`),
      ],
    });
  },
};
export default addList;
