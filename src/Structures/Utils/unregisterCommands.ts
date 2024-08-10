import { REST, Routes } from "discord.js";
import client from "../../index.js";
import ConsoleLogger from "../Classes/consoleLogger.js";

const logger = new ConsoleLogger();
const rest = new REST({ version: "10" }).setToken(client.config.TOKEN);

async () => {
  try {
    logger.info("Unregistering commands");

    await rest.put(Routes.applicationCommands(client.config.CLIENT_ID), {
      body: [],
    });
    await rest.put(
      Routes.applicationGuildCommands(
        client.config.CLIENT_ID,
        client.config.DevGuilds[0].id
      ),
      { body: [] }
    );

    logger.success("Successfully unregistered all / commands!");
  } catch (error) {
    logger.error(`There was an error: ${error}`);
  }
};
