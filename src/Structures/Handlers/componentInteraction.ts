import { SelectMenu, Button } from "../Interfaces/index.js";
import { BaseClient } from "../Classes/client.js";
import { pathToFileURL } from "url";

import ConsoleLogger from "../Classes/consoleLogger.js";
import { glob } from "glob";
import path from "path";

const logger = new ConsoleLogger();

export default class ComponentInteractionsHandler {
  constructor() {}

  public async loadSelectMenus(client: BaseClient) {
    const InteractionDir = await glob(
      `${process.cwd()}/dist/ComponentInteractions/Menus/**/*{.ts,.js}`
    );

    await Promise.all(
      InteractionDir.map(async (file, i) => {
        const interactionPath = path.resolve(file);
        const interaction: SelectMenu = (
          await import(`${pathToFileURL(interactionPath)}`)
        ).default;

        client.selectMenus.set(interaction.customId, interaction);
      })
    );
    client.currentStatus++;
    client.checkStatus();
    setTimeout(() => {
      logger.info("Select menus • loaded");
    }, 500);
  }

  public async loadButtons(client: BaseClient) {
    const InteractionDir = await glob(
      `${process.cwd()}/dist/ComponentInteractions/Buttons/*/*{.ts,.js}`
    );
    await Promise.all(
      InteractionDir.map(async (file, i) => {
        const interactionPath = path.resolve(file);
        const interaction: Button = (
          await import(`${pathToFileURL(interactionPath)}`)
        ).default;

        console.log(`Button: ${interaction.customId}`);

        client.buttons.set(interaction.customId, interaction);
      })
    );
    client.currentStatus++;
    client.checkStatus();

    setTimeout(() => {
      logger.info("Buttons • loaded");
    }, 500);
  }
}
