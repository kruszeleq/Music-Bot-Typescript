import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/Commands/command";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";
const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Wyświetla pomoc dotyczącą bota."),
  execute: async (
    interaction: ChatInputCommandInteraction,
    client: BaseClient
  ) => {
    const embed = new EmbedBuilder()
      .setColor(`#${color.Discord.BACKGROUND}`)
      .setDescription(
        `# Komendy\n ${client.commands
          .map(
            (command) =>
              `\`${command.data.name}\` - ${command.data.description}`
          )
          .join("\n")}`
      );

    interaction.reply({ embeds: [embed] });
  },
};
export default helpCommand;
