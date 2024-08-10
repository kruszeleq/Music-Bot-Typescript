import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { Metadata } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/index.js";

const playCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Odtwarzaj muzykę ze wspieranych linków albo wpisz wyszukiwanie"
    )
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Wklej link albo wpisz swoje wyszukiwanie")
        .setRequired(true)
    ),
  options: {
    inVoiceChannel: true,
  },

  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    await interaction.deferReply();
    const input = interaction.options.getString("query", true);
    const vc = interaction.member?.voice?.channel;
    if (!vc) return;

    client.distube
      .play<Metadata>(vc, input, {
        textChannel: interaction.channel ?? undefined,
        member: interaction.member,
        metadata: { interaction },
      })
      .catch((e) => {
        console.error(e);
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(`#${color.Material.RED}`)
              .setTitle("Distube")
              .setDescription(`Error: \`${e.message}\``),
          ],
        });
      });
  },
};

export default playCommand;
