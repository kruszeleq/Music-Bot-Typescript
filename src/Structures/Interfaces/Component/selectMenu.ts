import { PermissionsString } from "discord.js";

export interface SelectMenu {
  customId: string;
  allowInteractionAuthorOnly?: boolean;
  permissions?: Array<PermissionsString> | PermissionsString;
  checkIfCIDIncludes?: boolean; //Checks if Interaction ID includes the entered Custom ID (CID)
  execute: (...args: any[]) => any;
}
