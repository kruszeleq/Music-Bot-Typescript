import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Button } from "../../../Structures/Interfaces/index.js";
import { BaseClient } from "../../../Structures/Classes/client.js";
import { color } from "../../../Structures/Appearance/index.js";

const skipMusic: Button = {
  customId: "stop",
  allowInteractionAuthorOnly: false,
  inVoiceChannel: true,
  playing: true,
  execute: async (interaction: ButtonInteraction, client: BaseClient) => {
    if (!client.distube.getQueue(interaction)) return;
    interaction.message;

    await client.distube.stop(interaction);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription("Kolejka została zatrzymana"),
      ],
    });
  },
};

export default skipMusic;
