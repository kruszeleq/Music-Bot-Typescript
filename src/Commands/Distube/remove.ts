import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/Commands/command";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";
const removeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Usuń utwór z kolejki")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("Pozycja utworu w kolejce")
        .setRequired(true)
    ),
  options: {
    playing: true,
    inVoiceChannel: true,
  },
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    await interaction.deferReply();

    let position = interaction.options.getInteger("position");

    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return;

    if (position == 0)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setDescription("Nie możesz usunąć aktualnego utworu!"),
        ],
      });

    if (position > queue.songs.length)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setDescription("Nie znaleziono takiego utworu w kolejce!"),
        ],
      });

    const song = queue.songs[position];

    await queue.songs.splice(position, 1);

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(
            `<@${interaction.member.user.id}> usunął **[${song.name}](${song.url})** z kolejki!`
          )
          .setThumbnail(song.thumbnail),
      ],
    });
  },
};
export default removeCommand;
