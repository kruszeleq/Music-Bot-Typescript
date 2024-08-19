import { Events } from "distube";
import { Event } from "../../Structures/Interfaces/Events/event";

const debugEvent: Event = {
  name: Events.DEBUG,
  type: "distube",
  execute: (message) => {
    console.log(message);
  },
};

export default debugEvent;
