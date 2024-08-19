import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/Commands/command";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";
const pauseCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Zatrzymaj/wznów kolejkę"),
  options: {
    playing: true,
    inVoiceChannel: true,
  },
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return;

    const embed = new EmbedBuilder().setColor(`#${color.Discord.BACKGROUND}`);

    (await queue.paused) ? queue.resume() : queue.pause();
    interaction.reply({
      embeds: [
        embed.setDescription(
          `Kolejka została \`${queue.paused ? "zatrzymana" : "wznowiona"}\``
        ),
      ],
    });
  },
};

export default pauseCommand;
