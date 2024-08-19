import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Button } from "../../../Structures/Interfaces/index.js";
import { BaseClient } from "../../../Structures/Classes/client.js";
import { color } from "../../../Structures/Appearance/index.js";

const skipMusic: Button = {
  customId: "skip",
  allowInteractionAuthorOnly: false,
  inVoiceChannel: true,
  playing: true,
  execute: async (interaction: ButtonInteraction, client: BaseClient) => {
    const queue = await client.distube.getQueue(interaction);
    if (!queue) return;

    if (!queue.autoplay && queue.songs.length === 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setDescription(`W kolejce nie ma następnego utworu!`),
        ],
        ephemeral: true,
      });

    await client.distube.skip(interaction);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription("Utwór został pominięty."),
      ],
    });
  },
};

export default skipMusic;
