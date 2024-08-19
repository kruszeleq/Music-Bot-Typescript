import {
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildTextBasedChannel,
} from "discord.js";
import ButtonWrapper from "./button-wrapper.js";

export const followUp = async (
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  textChannel: GuildTextBasedChannel,
  button?: any[],
  disableAfter?: number
) => {
  let message;
  if (Date.now() - interaction.createdTimestamp < 15 * 60 * 1000) {
    message = await interaction.followUp({
      embeds: [embed],
      ...(button ? { components: button } : {}),
      fetchReply: true,
    });
  } else {
    await textChannel.send({
      embeds: [embed],
      ...(button ? { components: button } : {}),
    });
  }

  if (disableAfter) {
    setTimeout(async () => {
      const rows = message.components.flatMap((row) =>
        row.components.map((btn) => ButtonBuilder.from(btn).setDisabled(true))
      );

      await message.edit({ components: ButtonWrapper(rows) });
    }, disableAfter);
  }
};

//TODO podczas aktualizowania przyciskow aktualizuja sie tylko 5 przyciskow nie 6
