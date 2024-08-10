import { PermissionsString } from "discord.js";

export interface Button {
  customId: string;
  checkIFCustomIdIncludes?: boolean;
  permission?: Array<PermissionsString> | PermissionsString;
  allowInteractionAuthorOnly?: boolean;
  playing?: boolean;
  inVoiceChannel?: boolean;
  execute: (...args: any[]) => any;
}
