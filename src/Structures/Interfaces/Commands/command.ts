import { SlashCommandBuilder } from "discord.js";

interface CommandOptions {
  inVoiceChannel?: boolean;
  playing?: boolean;
}

export interface Command {
  data: SlashCommandBuilder | any;
  options?: CommandOptions;
  execute: (...args: any[]) => any;
}
