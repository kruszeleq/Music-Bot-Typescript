import { Events, Queue } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event";
import initQueue from "./../../../dist/Events/Distube/initqueue";
const initQueue: Event = {
  type: "distube",
  name: Events.INIT_QUEUE,
  execute: (queue: Queue) => {
    queue.volume = 100;
  },
};
export default initQueue;
