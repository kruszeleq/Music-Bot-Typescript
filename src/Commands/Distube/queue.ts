import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/index.js";
import { QueuePage } from "../../Structures/Utils/queuePage.js";

const queueCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Pokaż kolejkę utworów")
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Strona którą chcesz wyświetlić")
        .setRequired(false)
    ),
  options: {
    inVoiceChannel: true,
    playing: true,
  },
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    const args = interaction.options.getInteger("page");
    const queue = client.distube.getQueue(interaction);
    if (!queue) return;

    let pagesNum = Math.ceil(queue.songs.length / 10);
    if (pagesNum === 0) pagesNum = 1;

    const songStrings = [];
    for (let i = 1; i < queue.songs.length; i++) {
      const song = queue.songs[i];
      songStrings.push(
        `**${i}.** [${song.name}](${song.url}) \`[${song.formattedDuration}]\` • ${song.user}
				`
      );
    }

    const pages = [];
    for (let i = 0; i < pagesNum; i++) {
      const str = songStrings.slice(i * 10, i * 10 + 10).join("");
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Kolejka utworów - ${interaction.guild.name}`,
          iconURL: interaction.guild.iconURL(),
        })
        .setThumbnail(queue.songs[0].thumbnail)
        .setColor(`#${color.Discord.BACKGROUND}`)
        .setDescription(
          `**Aktualnie gra:**\n**[${queue.songs[0].name}](${
            queue.songs[0].url
          })** \`[${queue.songs[0].formattedDuration}]\` • ${
            queue.songs[0].user
          }\n\n**Reszta kolejki**${str == "" ? "  Nic" : "\n" + str}`
        )
        .setFooter({
          text: `Strona • ${i + 1}/${pagesNum} | ${
            queue.songs.length
          } • Utworów | ${queue.formattedDuration} • Długość kolejki`,
        });
      pages.push(embed);
    }
    if (!args) {
      if (pages.length == pagesNum && queue.songs.length > 10)
        QueuePage(
          client,
          interaction,
          pages,
          60000,
          queue.songs.length,
          queue.formattedDuration
        );
      else return interaction.reply({ embeds: [pages[0]] });
    } else {
      if (isNaN(args)) return interaction.reply("Strona musi być liczbą.");
      if (args > pagesNum)
        return interaction.reply(`Dostępne są tylko ${pagesNum} strony.`);
      const pageNum = args == 0 ? 1 : args - 1;
      return interaction.reply({ embeds: [pages[pageNum]] });
    }
  },
};

export default queueCommand;
