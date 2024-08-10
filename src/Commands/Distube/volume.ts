import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";

const volumeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Ustaw poziom głośności")
    .addNumberOption((option) =>
      option
        .setName("value")
        .setDescription("Podaj liczbę")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    ),
  options: {
    inVoiceChannel: true,
    playing: true,
  },
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    const volume = interaction.options.getNumber("value", true);

    client.distube.setVolume(interaction, volume);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(`Ustawiłem poziom głośności na \`${volume}%\``),
      ],
    });
  },
};

export default volumeCommand;
