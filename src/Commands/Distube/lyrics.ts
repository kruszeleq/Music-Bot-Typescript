import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/Commands/command";
import { BaseClient } from "../../Structures/Classes/client.js";
import Genius from "genius-lyrics";
import { color } from "../../Structures/Appearance/colors.js";

const lyricsFinder = new Genius.Client();

const lyricsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Znajdź tekst piosenki")
    .addStringOption((option) =>
      option.setName("song").setDescription("Tytuł utworu").setRequired(true)
    ),
  execute: async (
    interaction: ChatInputCommandInteraction,
    client: BaseClient
  ) => {
    await interaction.deferReply();
    const songString = interaction.options.getString("song");
    let lyrics: any;

    try {
      const searches = await lyricsFinder.songs.search(songString);
      const firstSong = searches[0];
      if (!firstSong)
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(`#${color.Material.RED}`)
              .setDescription(`Nie znaleziono tekstu utworu \`${songString}\``),
          ],
        });

      lyrics = await firstSong.lyrics();

      if (lyrics.length > 2048) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(`#${color.Material.RED}`)
              .setDescription(
                `Tekst utworu jest za długi, aby go wyświetlić.\n-# Tekst możesz znaleźć tutaj: [${firstSong.title}](${firstSong.url})`
              ),
          ],
        });
      }

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setTitle(`Tekst utworu ${firstSong.title}`)
            .setDescription(lyrics)
            .setThumbnail(firstSong.thumbnail),
        ],
      });
    } catch (error) {
      console.log(error);
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setDescription(`Nie znaleziono tekstu utworu \`${songString}\``),
        ],
      });
    }
  },
};

export default lyricsCommand;
