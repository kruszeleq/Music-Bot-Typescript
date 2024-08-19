import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Button } from "../../../Structures/Interfaces/index.js";
import { BaseClient } from "../../../Structures/Classes/client.js";
import { color } from "../../../Structures/Appearance/index.js";

const shuffle: Button = {
  customId: "shuffle",
  allowInteractionAuthorOnly: false,
  inVoiceChannel: true,
  playing: true,
  execute: async (interaction: ButtonInteraction, client: BaseClient) => {
    if (!client.distube.getQueue(interaction)) return;

    await client.distube.shuffle(interaction);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription("Pomieszano kolejkę"),
      ],
    });
  },
};

export default shuffle;
