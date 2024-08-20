import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildTextBasedChannel,
} from "discord.js";
let message;

export const followUp = async (
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  textChannel: GuildTextBasedChannel,
  button?: any[]
) => {
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
};

export { message };
//TODO podczas aktualizowania przyciskow aktualizuja sie tylko 5 przyciskow nie 6
