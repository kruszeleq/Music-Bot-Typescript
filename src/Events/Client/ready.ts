import { Event } from "../../Structures/Interfaces/Events/event.js";
import { ActivityType } from "discord.js";
import os from "os";
import clientSchema from "../../Structures/Schemas/clientSchema.js";

const event: Event = {
  name: "ready",
  type: "discord",
  options: {
    once: true,
  },

  execute: async (client) => {
    client.user.setPresence({
      activities: [{ name: "muzyki.", type: ActivityType.Listening }],
      status: "dnd",
    });

    async function getMemoryUsage() {
      return (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);
    }

    let memArray: string[] = [];

    setInterval(async () => {
      memArray.push(await getMemoryUsage());

      if (memArray.length >= 14) memArray.shift();

      await clientSchema.findOneAndUpdate(
        {
          Client: true,
        },
        {
          Memory: memArray,
        },
        {
          upsert: true,
        }
      );
    }, 5 * 1000);
  },
};
export default event;
