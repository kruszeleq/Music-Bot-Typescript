import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/colors.js";

const loopCommand: Command = {
  data: new SlashCommandBuilder().setName("loop").setDescription("Włącz pętlę"),
  options: {
    inVoiceChannel: true,
    playing: true,
  },

  execute: async (
    interaction: ChatInputCommandInteraction<"cached">,
    client: BaseClient
  ) => {
    if (!client.distube.getQueue(interaction)) return;

    let mode = await client.distube.setRepeatMode(interaction);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(`#${color.Discord.BACKGROUND}`)
          .setDescription(
            `Pętla jest ${
              mode
                ? mode == 2
                  ? "`włączona dla kolejki`"
                  : "`włączona dla utworu`"
                : "`wyłączona`"
            }`
          ),
      ],
    });
  },
};

export default loopCommand;
