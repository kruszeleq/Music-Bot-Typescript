import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Button } from "../../../Structures/Interfaces/index.js";
import { BaseClient } from "../../../Structures/Classes/client.js";
import { color } from "../../../Structures/Appearance/index.js";

const skipMusic: Button = {
  customId: "pause-unpause",
  allowInteractionAuthorOnly: false,
  inVoiceChannel: true,
  playing: true,
  execute: async (interaction: ButtonInteraction, client: BaseClient) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return;

    const embed = new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`);

    (await queue.paused) ? queue.resume() : queue.pause();
    await interaction.reply({
      embeds: [
        embed.setDescription(
          `Kolejka została \`${queue.paused ? "zatrzymana" : "wznowiona"}\``
        ),
      ],
    });
  },
};

export default skipMusic;
