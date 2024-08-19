import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Button } from "../../../Structures/Interfaces/index.js";
import { BaseClient } from "../../../Structures/Classes/client.js";
import { color } from "../../../Structures/Appearance/index.js";

const skipMusic: Button = {
  customId: "loop",
  allowInteractionAuthorOnly: false,
  inVoiceChannel: true,
  playing: true,
  execute: async (interaction: ButtonInteraction, client: BaseClient) => {
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

export default skipMusic;
