import { Events, Queue, Song } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event.js";
import { ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Metadata } from "../../Structures/Classes/client.js";
import { followUp } from "../../Structures/Utils/followUp.js";
import { color, icon } from "../../Structures/Appearance/index.js";
import ButtonWrapper from "../../Structures/Utils/button-wrapper.js";

const playSong: Event = {
  name: Events.PLAY_SONG,
  type: "distube",
  options: {
    once: false,
    rest: false,
  },
  execute: async (queue: Queue, song: Song<Metadata>) => {
    const buttons = [
      new ButtonBuilder()
        .setCustomId("skip")
        .setEmoji(icon.music.skip)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("autoplay")
        .setEmoji(icon.music.autoplay)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("loop")
        .setEmoji(icon.music.repeat)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("pause-unpause")
        .setEmoji(icon.music.pause)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("stop")
        .setEmoji(icon.music.stop)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setEmoji(icon.music.shuffle)
        .setStyle(ButtonStyle.Primary),
    ];

    await followUp(
      song.metadata.interaction,
      new EmbedBuilder()
        .setColor(`#${color.Discord.BACKGROUND}`)
        .setTitle(`Odtwarzam utwór...`)
        .setThumbnail(`${song.thumbnail}`)
        .setDescription(
          `### **[${song.name}](${song.url})** - \`${song.formattedDuration}\`\n-# **Dodał:** ${song.user} \n### ${icon.reply.default} **Informacje**`
        )
        .setFields(
          {
            name: `Autoplay`,
            value: `\`${queue.autoplay ? "Wł." : "Wył."}\``,
            inline: true,
          },
          {
            name: `Efekty`,
            value: `\`${queue.filters.names.join(", ") || "Wył."}\``,
            inline: true,
          },
          {
            name: `Pętla`,
            value: `\`${
              queue.repeatMode
                ? queue.repeatMode === 2
                  ? "Dla kolejki"
                  : "Dla utworu"
                : "Wył."
            }\``,
            inline: true,
          },
          {
            name: `Głośność`,
            value: `\`${queue.volume}\`%`,
            inline: true,
          }
        ),
      queue.textChannel,
      ButtonWrapper(buttons)
    ).catch(console.error);
  },
};

export default playSong;
