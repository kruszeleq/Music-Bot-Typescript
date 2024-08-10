import { Events } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event";
const ffmpegDebug: Event = {
  name: Events.FFMPEG_DEBUG,
  type: "distube",
  options: {
    once: false,
    rest: false,
  },
  execute: async (message: string) => {
    console.log(message);
  },
};

export default ffmpegDebug;
