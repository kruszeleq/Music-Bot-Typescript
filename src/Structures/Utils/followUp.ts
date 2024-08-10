import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildTextBasedChannel,
} from "discord.js";

export const followUp = async (
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  textChannel: GuildTextBasedChannel,
  button?: any
) => {
  if (Date.now() - interaction.createdTimestamp < 15 * 60 * 1000) {
    button
      ? await interaction.followUp({ embeds: [embed], components: [button] })
      : await interaction.followUp({ embeds: [embed] });
  } else {
    button
      ? await textChannel.send({ embeds: [embed], components: [button] })
      : await textChannel.send({ embeds: [embed] });
  }
};
