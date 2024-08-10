import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Button } from "../../../Structures/Interfaces/index.js";
import { BaseClient } from "../../../Structures/Classes/client.js";
import { color } from "../../../Structures/Appearance/index.js";

const skipMusic: Button = {
  customId: "autoplay",
  allowInteractionAuthorOnly: false,
  inVoiceChannel: true,
  playing: true,
  execute: async (
    interaction: ChatInputCommandInteraction,
    client: BaseClient
  ) => {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(
            `Autoodtwarzanie: \`${
              client.distube.toggleAutoplay(interaction) ? "Wł." : "Wył."
            }\``
          ),
      ],
    });
  },
};

export default skipMusic;
