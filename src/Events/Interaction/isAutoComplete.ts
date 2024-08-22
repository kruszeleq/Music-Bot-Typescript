import {
  AutocompleteInteraction,
  ChannelType,
  DMChannel,
  EmbedBuilder,
} from "discord.js";
import { Event } from "../../Structures/Interfaces/Events/event";
import { BaseClient } from "../../Structures/Classes/client.js";
import { color } from "../../Structures/Appearance/index.js";
const isAutoCompleteEvent: Event = {
  name: "interactionCreate",
  type: "discord",
  execute: async (interaction: AutocompleteInteraction, client: BaseClient) => {
    if (!interaction.isAutocomplete()) return;
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
    //TODO cancel interaction reply
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;
    await command
      .autocomplete(interaction)
      .catch((error) => console.error(error));
  },
};

export default isAutoCompleteEvent;
