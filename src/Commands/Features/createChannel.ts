import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../Structures/Interfaces/Commands/command";
import { BaseClient } from "../../Structures/Classes/client.js";
import createChannel from "../../Structures/Schemas/createChannel.js";
import { color } from "../../Structures/Appearance/colors.js";
const createChannelCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("vcsetup")
    .setDescription(
      "Ustaw kanał, poprzez który będzie można tworzyć prywatne kanały głosowe"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("wybierz kanał")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    ),
  execute: async (
    interaction: ChatInputCommandInteraction,
    client: BaseClient
  ) => {
    const { guild, options } = interaction;

    try {
      const channel = options.getChannel("channel");

      await createChannel.findOneAndUpdate(
        {
          GuildId: guild.id,
        },
        { ChannelId: channel.id },
        { new: true, upsert: true }
      );

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setDescription(`Ustawiłem kanał <#${channel.id}>`),
        ],
        ephemeral: true,
      });
    } catch (e) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setDescription(`Błąd: ${e}`),
        ],
        ephemeral: true,
      });
    }
  },
};

export default createChannelCommand;
