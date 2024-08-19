import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";

const QueuePage = async (
  client,
  message,
  pages,
  timeout,
  queueLength,
  queueDuration
) => {
  if (!message || !message.channel) throw new Error("Kanał jest niedostępny.");
  if (!pages) throw new Error("Strony nie są podane");

  const row1 = new ButtonBuilder()
    .setCustomId("back")
    .setLabel("⬅")
    .setStyle(ButtonStyle.Secondary);
  const row2 = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("➡")
    .setStyle(ButtonStyle.Secondary);
  const row = new ActionRowBuilder().addComponents(row1, row2);

  let page = 0;
  const curPage = await message.editReply({
    embeds: [
      pages[page].setFooter({
        text: `Strona • ${page + 1}/${
          pages.length
        } | ${queueLength} • Utworów | ${queueDuration} • Długość kolejki`,
      }),
    ],
    components: [row],
    allowedMentions: { repliedUser: false },
  });

  if (pages.length == 0) return;

  const filter = (m) => m.user.id === message.user.id;
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (interaction: ButtonInteraction) => {
    if (!interaction.deferred) await interaction.deferUpdate();
    page += interaction.customId === "next" ? 1 : -1;
    page = (page + pages.length) % pages.length;
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `Strona • ${page + 1}/${
            pages.length
          } | ${queueLength} • Utworów | ${queueDuration} • Długość kolejki`,
        }),
      ],
      components: [row],
    });
  });

  collector.on("end", () => {
    const disabled = new ActionRowBuilder().addComponents(
      row1.setDisabled(true),
      row2.setDisabled(true)
    );
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `Strona • ${page + 1}/${
            pages.length
          } | ${queueLength} • Utworów | ${queueDuration} • Długość kolejki`,
        }),
      ],
      components: [disabled],
    });
  });

  return curPage;
};

export { QueuePage };
