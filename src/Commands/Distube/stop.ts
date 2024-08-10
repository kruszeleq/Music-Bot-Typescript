import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";

const stopCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Zatrzymaj kolejkę"),
  options: {
    inVoiceChannel: true,
    playing: true,
  },
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    try {
      await client.distube.stop(interaction);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription("Kolejka została zatrzymana"),
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

export default stopCommand;
