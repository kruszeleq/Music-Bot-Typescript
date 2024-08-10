import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import type { Queue } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event.js";
import { color } from "../../Structures/Appearance/index.js";

const addList: Event = {
  name: Events.FINISH,
  type: "distube",
  execute: (queue: Queue) => {
    queue.textChannel?.send({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(`Kolejka jest pusta!`),
      ],
    });
  },
};
export default addList;
