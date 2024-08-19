import { defaultFilters } from "distube";
import { Command } from "../../Structures/Interfaces/Commands/command";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/index.js";

const filter: Command = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Set the filter for the music player")
    .addStringOption((option) =>
      option
        .setName("filter")
        .setDescription("The filter to set")
        .setRequired(true)
        .addChoices(
          ...Object.keys(defaultFilters).map((k) => ({ name: k, value: k })),
          { name: "off", value: "off" }
        )
    ),
  options: {
    playing: true,
    inVoiceChannel: true,
  },
  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    await interaction.deferReply();
    const filter = interaction.options.getString("filter");
    const filters = client.distube.getQueue(interaction)!.filters;
    if (filter == "off" && filters.size) filters.clear();
    else if (filters.has(filter)) filters.remove(filter);
    else filters.add(filter);

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(
            `Aktualne filtry w kolejce: \`${
              filters.names.join(", ") || "Wył."
            }\``
          ),
      ],
    });
  },
};
export default filter;
