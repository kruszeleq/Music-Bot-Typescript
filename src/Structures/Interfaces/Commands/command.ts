import { SlashCommandBuilder } from "discord.js";

interface CommandOptions {
  inVoiceChannel?: boolean;
  playing?: boolean;
}

export interface Command {
  data: SlashCommandBuilder | any;
  options?: CommandOptions;
  autocomplete?: (...args: any[]) => any;
  execute: (...args: any[]) => any;
}
