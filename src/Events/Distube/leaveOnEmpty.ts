import { EmbedBuilder, VoiceState } from "discord.js";
import { Event } from "../../Structures/Interfaces/Events/event";
import { BaseClient } from "../../Structures/Classes/client.js";
import { isVoiceChannelEmpty } from "distube";
import { color } from "../../Structures/Appearance/colors.js";
const leaveOnEmpty: Event = {
  type: "discord",
  name: "voiceStateUpdate",
  execute: (oldState: VoiceState, newState: VoiceState, client: BaseClient) => {
    if (!oldState?.channel) return;

    const voice = client.distube.voices.get(oldState);
    const queue = client.distube.getQueue(oldState);

    if (voice && isVoiceChannelEmpty(oldState)) {
      setTimeout(() => {
        if (voice && isVoiceChannelEmpty(oldState)) {
          queue.textChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(`#${color.Discord.BACKGROUND}`)
                .setDescription("Kanał jest pusty, wychodzę..."),
            ],
          });
          voice.leave();
        }
      }, 5 * 1000 * 60);
    }
  },
};
export default leaveOnEmpty;
