import { color } from "../../Structures/Appearance/colors.js";
import { BaseClient } from "../../Structures/Classes/client";
import { Event } from "../../Structures/Interfaces/Events/event";
import { DMChannel, EmbedBuilder } from "discord.js";
import type { ChannelType, Interaction } from "discord.js";

const interactionCreate: Event = {
  name: "interactionCreate",
  type: "discord",
  options: {
    once: false,
    rest: false,
  },
  execute: async (interaction: Interaction, client: BaseClient) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.channel instanceof DMChannel)
      return interaction.user.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setDescription(
              "Nie wykonuję poleceń w prywatnych wiadomościach!\n-# Aby skorzystać z moich poleceń, użyj ich na serwerze na którym jestem!"
            ),
        ],
      });
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setDescription(
              "> This command is **outdated**, please try again."
            ),
        ],
        ephemeral: true,
      });
    }
    if (
      command.options?.inVoiceChannel &&
      !interaction.guild.members.cache.get(interaction.user.id).voice.channel
    ) {
      return interaction.reply({
        content: "Musisz być na kanale głosowym, aby użyć tej komendy!",
        ephemeral: true,
      });
    }

    if (command.options?.playing && !client.distube.getQueue(interaction)) {
      return interaction.reply({
        content: "Musi być coś w kolejce aby użyć tej komendy!",
        ephemeral: true,
      });
    }

    command.execute(interaction, client);
  },
};

export default interactionCreate;
