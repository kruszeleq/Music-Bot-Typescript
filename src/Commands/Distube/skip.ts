import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/index.js";

const skipCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Pomiń utwór."),
  options: {
    inVoiceChannel: true,
    playing: true,
  },
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    try {
      const queue = await client.distube.getQueue(
        interaction.member?.voice?.channel
      );
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

      queue.songs[0].skipped = true;
      await client.distube.skip(interaction);

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription("Utwór został pominięty."),
        ],
      });
    } catch (e) {
      console.error(e);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setTitle("DisTube")
            .setDescription(`Error: \`${e}\``),
        ],
      });
    }
  },
};

export default skipCommand;
