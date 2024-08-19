import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { Metadata } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/index.js";
import ytsr from "@distube/ytsr";

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
        .setAutocomplete(true)
    ),
  options: {
    inVoiceChannel: true,
  },

  autocomplete: async (
    interaction: AutocompleteInteraction<"cached">,
    client: BaseClient
  ) => {
    const option = interaction.options.getFocused();
    const options: ApplicationCommandOptionChoiceData[] = [];

    try {
      await ytsr(option, { limit: 5 }).then((result) => {
        for (const item of result.items) {
          options.push({ name: item.name.slice(0, 99), value: item.url });
        }
      });
    } catch (e) {}

    await interaction.respond(options);
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
