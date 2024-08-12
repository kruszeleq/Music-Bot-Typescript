import { ChannelType, VoiceState } from "discord.js";
import { Event } from "../../Structures/Interfaces/Events/event";
import { BaseClient } from "../../Structures/Classes/client.js";
import createChannel from "../../Structures/Schemas/createChannel.js";
const createVoice: Event = {
  type: "discord",
  name: "voiceStateUpdate",
  options: {
    once: false,
    rest: false,
  },
  execute: async (
    oldState: VoiceState,
    newState: VoiceState,
    client: BaseClient
  ) => {
    const { member, guild } = newState;
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    const Data = await createChannel.findOne({ GuildId: guild.id });
    if (!Data) return;

    const jtc = Data.ChannelId;

    if (oldChannel !== newChannel && newChannel && newChannel.id === jtc) {
      const voiceChannel = await guild.channels.create({
        name: member.user.tag,
        type: ChannelType.GuildVoice,
        parent: newChannel.parent,
      });

      client.voiceGenerator.set(member.id, voiceChannel.id);

      return setTimeout(() => member.voice.setChannel(voiceChannel), 500);
    }

    const ownedChannel = client.voiceGenerator.get(member.id);
    if (
      ownedChannel &&
      oldChannel.id == ownedChannel &&
      (!newChannel || newChannel.id !== ownedChannel)
    ) {
      client.voiceGenerator.set(member.id, null);
      oldChannel.delete().catch((e) => {
        console.log(e);
      });
    }
  },
};

export default createVoice;
