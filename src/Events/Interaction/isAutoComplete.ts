import { AutocompleteInteraction } from "discord.js";
import { Event } from "../../Structures/Interfaces/Events/event";
import { BaseClient } from "../../Structures/Classes/client.js";
const isAutoCompleteEvent: Event = {
  name: "interactionCreate",
  type: "discord",
  execute: async (interaction: AutocompleteInteraction, client: BaseClient) => {
    if (!interaction.isAutocomplete()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;
    await command
      .autocomplete(interaction)
      .catch((error) => console.error(error));
  },
};

export default isAutoCompleteEvent;
