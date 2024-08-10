import { Command } from "../../Structures/Interfaces/index.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";

const autoplayCommand: Command = {
  options: {
    inVoiceChannel: true,
    playing: true,
  },
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Włącz autoodtwarzanie"),
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription(
              `Autoodtwarzanie: \`${
                client.distube.toggleAutoplay(interaction) ? "Wł." : "Wył."
              }\``
            ),
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

export default autoplayCommand;
