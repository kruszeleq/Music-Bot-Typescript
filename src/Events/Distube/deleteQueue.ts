import { Events } from "distube";
import { ButtonBuilder } from "discord.js";
import type { Queue, Song } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event.js";
import { message } from "../../Structures/Utils/followUp.js";
import ButtonWrapper from "../../Structures/Utils/button-wrapper.js";
import { Metadata } from "../../Structures/Classes/client.js";

const addList: Event = {
  name: Events.DELETE_QUEUE,
  type: "distube",
  execute: async (queue: Queue) => {
    if ((queue.stopped = true)) disableButtons();
    async function disableButtons() {
      const rows = message.components.flatMap((row) =>
        row.components.map((btn) => ButtonBuilder.from(btn).setDisabled(true))
      );

      await message.edit({ components: ButtonWrapper(rows) });
    }
  },
};
export default addList;
