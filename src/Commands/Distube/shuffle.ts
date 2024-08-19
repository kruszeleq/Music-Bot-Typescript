import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/Commands/command";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";
const shuffleCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Pomieszaj kolejkę"),
  options: {
    playing: true,
    inVoiceChannel: true,
  },
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return;

    await client.distube.shuffle(interaction);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription("Pomieszano kolejkę"),
      ],
    });
  },
};
export default shuffleCommand;
