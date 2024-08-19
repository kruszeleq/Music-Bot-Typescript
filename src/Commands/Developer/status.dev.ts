import {
  AttachmentBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import gradient from "chartjs-plugin-gradient";
import DB from "../../Structures/Schemas/clientSchema.js";
import mongoose from "mongoose";
import { icon } from "../../Structures/Appearance/icon.js";
import { ChartConfiguration, ChartData } from "chart.js";
import { Command } from "../../Structures/Interfaces/index.js";
import { color } from "../../Structures/Appearance/colors.js";
const command: Command = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Bot Status Information")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const docs = await DB.findOne({ Client: true });
    /**Graph Colors */
    const colors = {
      purple: {
        zero: "rgba(149, 76, 233, 0)",
        low: "rgba(149, 76, 233, 0.1)",
        quarter: "rgba(149, 76, 233, 0.25)",
        half: "rgba(149, 76, 233, 0.5)",
        default: "rgba(149, 76, 233, 1)",
      },
      indigo: {
        zero: "rgba(80, 102, 120, 0)",
        low: "rgba(80, 102, 120, 0.1)",
        quarter: "rgba(80, 102, 120, 0.25)",
        half: "rgba(80, 102, 120, 0.5)",
        default: "rgba(80, 102, 120, 1)",
      },
      green: {
        zero: "rgba(92, 221, 139, 0)",
        low: "rgba(92, 221, 139, 0.1)",
        quarter: "rgba(92, 221, 139, 0.25)",
        half: "rgba(92, 221, 139, 0.5)",
        default: "rgba(92, 221, 139, 1)",
      },
    };
    /** Change according to the setInterval() in [ready.ts](../../Events/Client/ready.ts) */
    const labels = [
      "60",
      "55",
      "50",
      "45",
      "40",
      "35",
      "30",
      "25",
      "20",
      "15",
      "10",
      "5",
    ];
    const Memory = docs.Memory;
    const AvgMem =
      Memory.reduce((a, b) => a + Math.floor(b), 0) / Memory.length;
    /** Canvas generation */
    const canvas = new ChartJSNodeCanvas({
      width: 1500,
      height: 720,
      plugins: {
        modern: [gradient],
      },
      chartCallback: (ChartJS) => {},
    });
    /** Chart Data */
    const chartData: ChartData = {
      labels: labels,
      datasets: [
        {
          label: "RAM Usage",
          fill: true,
          gradient: {
            backgroundColor: {
              axis: "y",
              colors: {
                0: colors.green.zero,
                100: colors.green.quarter,
              },
            },
          },
          pointBackgroundColor: colors.green.default,
          borderColor: colors.green.default,
          data: Memory,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    };
    /** Chart Configuration */
    const ChartConfig: ChartConfiguration = {
      type: "line",
      data: chartData,
      options: {
        layout: {
          padding: 10,
        },
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: "RAM Usage",
            align: "center",
            color: "rgba(255, 255, 255, 0.8)",
            font: {
              family: "'Raleway', sans-serif",
              size: 18,
            },
          },
          legend: {
            display: false,
            position: "top",
            labels: {
              color: "rgba(255, 255, 255, 0.8)",
              font: {
                family: "Raleway",
                style: "normal",
                weight: "500",
                size: 18,
              },
            },
          },
        },
        scales: {
          xAxes: {
            grid: {
              display: false,
            },
            ticks: {
              // @ts-ignore
              autoSkip: false,
              padding: 10,
              maxRotation: 0,
              minRotation: 0,
              font: {
                family: "Raleway",
                size: 18,
              },
            },
          },
          yAxes: {
            scaleLabel: {
              display: true,
              labelString: "Usage",
              padding: 10,
            },
            gridLines: {
              display: true,
              color: colors.indigo.quarter,
            },
            ticks: {
              // @ts-ignore
              beginAtZero: false,
              max: 63,
              min: 57,
              padding: 10,
              font: {
                family: "Raleway",
                size: 14,
              },
            },
          },
        },
      },
      plugins: [
        {
          id: "mainBg",
          beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext("2d");
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#192027";
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          },
        },
      ],
    };
    const image = await canvas.renderToBuffer(ChartConfig);
    const attachment = new AttachmentBuilder(image, {
      name: "chart.png",
      description: "Client statistics chart",
    });
    if (!docs || Memory.length < 12) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(`#${color.Material.RED}`)
            .setTitle("🛑 Nie znaleziono danych")
            .setDescription("Proszę poczekać, aż informacje się zbiorą!"),
        ],
      });
    }
    const response = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Status klienta")
      .addFields(
        {
          name: `${icon.reply.default} Główne`,
          value: `**\`•\` Klient**: ${
            icon.color.green
          } ONLINE \n**\`•\` Ping**: ${pingStatus(client.ws.ping)} ${
            client.ws.ping
          }ms \n**\`•\` Uptime**: <t:${parseInt(
            `${client.readyTimestamp / 1000}`
          )}:R> \nㅤ`,
          inline: false,
        },
        {
          name: `${icon.reply.default} Baza danych`,
          value: `**\`•\` Stan połączenia:**: ${dbStatus(
            mongoose.connection.readyState
          )}\nㅤ`,
          inline: true,
        },
        {
          name: `${icon.reply.default} Zasoby`,
          value: `**\`•\` Średnie zużycie RAM'u:**: ${AvgMem.toFixed(1)}Mb`,
          inline: false,
        }
      )
      .setImage("attachment://chart.png");
    await interaction.editReply({
      embeds: [response],
      files: [attachment],
    });
  },
};
function dbStatus(val) {
  let status = "";
  switch (val) {
    case 0:
      {
        status = `${icon.color.red} Rozłączono`;
      }
      break;
    case 1:
      {
        status = `${icon.color.green} Połączono`;
      }
      break;
    case 2:
      {
        status = `${icon.color.yellow} Łączenie`;
      }
      break;
    case 3:
      {
        status = `${icon.color.blue} Rozłączanie`;
      }
      break;
  }
  return status;
}
function pingStatus(ping) {
  var emoji = "";
  switch (true) {
    case ping <= 100:
      emoji = `${icon.ping.green}`;
      break;
    case ping > 100 && ping < 250:
      emoji = `${icon.ping.yellow}`;
      break;
    case ping > 250:
      emoji = `${icon.ping.red}`;
      break;
  }
  return emoji;
}
export default command;
