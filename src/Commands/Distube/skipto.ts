import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";

const skiptoCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Pomiń do konkretnej pozycji na liście")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("Podaj pozycję utworu na liście")
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
    const args = interaction.options.getInteger("position", true);

    const queue = await client.distube.getQueue(interaction);

    if (args > queue.songs.length || (args && !queue.songs[args]))
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription(`Nie ma utworu na tej pozycji!`),
        ],
      });

    const song = await client.distube.jump(interaction, args);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(`Przeskoczyłem do \`${song.name || song.url}\``),
      ],
    });
  },
};

export default skiptoCommand;
