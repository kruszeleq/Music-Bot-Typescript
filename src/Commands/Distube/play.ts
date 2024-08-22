import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Soundcloud } from "soundcloud.ts";
import { color } from "../../Structures/Appearance/index.js";
import { BaseClient, Metadata } from "../../Structures/Classes/client.js";
import { Command } from "../../Structures/Interfaces/index.js";

const soundcloud = new Soundcloud();

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

  autocomplete: async (interaction: AutocompleteInteraction) => {
    const option = interaction.options.getFocused();
    const options: ApplicationCommandOptionChoiceData[] = [];

    try {
      await soundcloud.tracks.searchV2({ q: option }).then((result) => {
        for (const track of result.collection) {
          options.push({ name: track.title, value: track.permalink_url });
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
