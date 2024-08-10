import { Event } from "../Interfaces/Events/event.js";
import { BaseClient } from "../Classes/client.js";
import chalk from "chalk";
import ConsoleLogger from "./../Classes/consoleLogger.js";
import AsciiTable from "ascii-table";
import path from "path";
import { pathToFileURL } from "url";
import { glob } from "glob";
import { DisTubeEvents } from "distube";
import { ClientEvents } from "discord.js";

const logger = new ConsoleLogger();

export default class ClientEventsHandler {
  constructor() {}

  public async loadEvents(client: BaseClient) {
    const EventsTable = new AsciiTable()
      .setHeading("⠀⠀⠀⠀⠀", "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Events⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "⠀⠀Status⠀⠀")
      .setBorder("┋", "═", "●", "●")
      .setAlign(2, AsciiTable.CENTER);
    const EventsDir = await glob([
      `${process.cwd()}/dist/Events/**/*{.ts,.js}`,
    ]);

    EventsDir.forEach(async (file, i) => {
      EventsTable.addRow(
        (i + 1).toString() + ".",
        file.split(/[\\/]/).pop(),
        "» 🌱 «"
      );

      const eventPath = path.resolve(file);
      const event: Event = (await import(`${pathToFileURL(eventPath)}`))
        .default;

      if (event.type === "distube") {
        client.distube.on(event.name as keyof DisTubeEvents, (...args) =>
          event.execute(...args, client)
        );
      } else {
        if (event.options?.once) {
          client.once(event.name as keyof ClientEvents, (...args) =>
            event.execute(...args, client)
          );
        } else {
          client.on(event.name as keyof ClientEvents, (...args) =>
            event.execute(...args, client)
          );
        }
      }

      client.events.set(event.name, event);
    });

    if (EventsDir.length === 0)
      EventsTable.addRow("0.", "Missing Events", "» 🔆 «");
    console.log(chalk.white(EventsTable.toString()));
    setTimeout(async () => {
      logger.info("Client Events • loaded");
      client.currentStatus++;
      client.checkStatus();
    }, 1000);
  }
}
