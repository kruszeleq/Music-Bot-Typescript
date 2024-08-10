import { ClientEvents } from "discord.js";
import { DisTubeEvents } from "distube";

type CombinedEventKeys = keyof ClientEvents | keyof DisTubeEvents;

interface EventOptions {
  once?: boolean;
  rest?: boolean;
}

export interface Event {
  name: CombinedEventKeys;
  options?: EventOptions;
  type: "discord" | "distube";
  execute: (...args: any[]) => any;
}
