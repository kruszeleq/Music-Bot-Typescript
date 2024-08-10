import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import type { Queue, Song } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event.js";
import { color } from "../../Structures/Appearance/index.js";
import { Metadata } from "../../Structures/Classes/client.js";
import { followUp } from "../../Structures/Utils/followUp.js";

const addList: Event = {
  name: Events.ERROR,
  type: "distube",
  execute: async (error: Error, queue: Queue, song?: Song<Metadata>) => {
    if (song) {
      await followUp(
        song.metadata.interaction,
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(
            `❗ Wystąpił błąd: ${error.toString().slice(0, 1974)}`
          ),
        queue.textChannel!
      );
    } else if (queue.textChannel) {
      await queue.textChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription(
              `❗ Wystąpił błąd: ${error.toString().slice(0, 1974)}`
            ),
        ],
      });
    } else {
      console.error(error);
    }
  },
};
export default addList;
