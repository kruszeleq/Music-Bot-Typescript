import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  EmbedBuilder,
} from "discord.js";
import { Event } from "../../Structures/Interfaces/Events/event";
import { BaseClient } from "./../../Structures/Classes/client";
import { color } from "../../Structures/Appearance/index.js";
import { Button } from "../../Structures/Interfaces/index.js";

const event: Event = {
  name: "interactionCreate",
  type: "discord",
  options: {
    once: false,
    rest: false,
  },
  execute: async (interaction: ButtonInteraction, client: BaseClient) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "next" || interaction.customId === "back")
      return;

    let button: Button;

    for (const key of client.buttons.keys()) {
      if (interaction.customId.includes(key)) {
        let checkButton = client.buttons.get(key);
        if (
          !checkButton.checkIFCustomIdIncludes &&
          key !== interaction.customId
        ) {
          return;
        } else {
          button = checkButton;
        }
      }
    }

    if (!button) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription(
              `Ten przycisk jest **przedawniony**, spróbuj ponownie później.`
            ),
        ],
        ephemeral: true,
      });
    }

    if (
      button.inVoiceChannel &&
      !interaction.guild.members.cache.get(interaction.user.id).voice.channel
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription(`Musisz być na kanale głosowym!`),
        ],
        ephemeral: true,
      });
    }

    if (button.playing && !client.distube.getQueue(interaction)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription(`Kolejka nie może być pusta!`),
        ],
        ephemeral: true,
      });
    }

    if (
      button.allowInteractionAuthorOnly &&
      interaction.user.id !== interaction.message.interaction.user.id
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription(`Nie masz dostępu do tego przycisku`),
        ],
        ephemeral: true,
      });

    button.execute(interaction, client);
  },
};

export default event;
