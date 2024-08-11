import {
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
  Partials,
  version,
} from "discord.js";

import { SpotifyPlugin } from "@distube/spotify";
import { YouTubePlugin } from "@distube/youtube";
import { DisTube } from "distube";
import { SoundCloudPlugin } from "@distube/soundcloud";

import { Command } from "../Interfaces/Commands/command.js";
import { Event } from "../Interfaces/Events/event.js";
import { Config } from "../Interfaces/Config/config.js";
import { Button, SelectMenu } from "../Interfaces/index.js";

import clientConfig from "../../config.js";

import ConsoleLogger from "./consoleLogger.js";

import ClientEventsHandler from "../Handlers/clientEvents.js";
import SlashCommandHandler from "../Handlers/slashCommands.js";
import ComponentInteractionsHandler from "../Handlers/componentInteraction.js";

import fs from "fs";

import mongoose from "mongoose";

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const logger = new ConsoleLogger();
class DistubeClient extends Client<true> {
  distube = new DisTube(this, {
    plugins: [
      new YouTubePlugin({
        cookies: JSON.parse(
          fs.readFileSync(`${process.cwd()}/src/cookies.json`, "utf8")
        ),
      }),
      new SoundCloudPlugin(),
      new SpotifyPlugin(),
    ],
    emitNewSongOnly: true,
    ffmpeg: {
      path: "C:/Users/krusz/Desktop/programowanko/ffmpeg-7.0-essentials_build/bin/ffmpeg.exe",
    },
  });
  constructor(options: ClientOptions) {
    super(options);
  }
}

export class BaseClient extends DistubeClient {
  public commands: Collection<string, Command>;
  public events: Collection<string, Event>;

  public selectMenus: Collection<string, SelectMenu>;
  public buttons: Collection<string, Button>;

  public currentStatus: number;
  public config: Config;

  constructor() {
    super({
      intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
      partials: [User, Message, GuildMember, ThreadMember],
    });

    this.commands = new Collection();
    this.events = new Collection();

    this.selectMenus = new Collection();
    this.buttons = new Collection();

    this.currentStatus = 0;
    this.config = clientConfig;
  }

  public async start() {
    await this.registerModules();

    await this.connectMongoDB();

    await this.login(this.config.TOKEN);
  }

  private async registerModules() {
    const { loadEvents } = new ClientEventsHandler();
    const { loadSlashCommands } = new SlashCommandHandler();
    const { loadButtons, loadSelectMenus } = new ComponentInteractionsHandler();

    try {
      await loadEvents(this);
      await loadButtons(this);
      await loadSelectMenus(this);
      await loadSlashCommands(this);
    } catch (err) {
      logger.error(`Handler failed to load • ${err}`);
    }
  }

  private async connectMongoDB() {
    try {
      await mongoose.connect(`${this.config.Database?.MongoDB}`);
      logger.info("Mongo Database • connected");

      this.currentStatus++;
      this.checkStatus();
    } catch (err) {
      logger.error(`Mongo Database • ${err}`);
    }
  }

  public checkStatus(): void {
    if (this.currentStatus > 4) {
      console.log("---");
      logger.success(`Client • ready to use (v.${version})\n---`);
    }
  }
}

export interface Metadata {
  interaction: ChatInputCommandInteraction<"cached">;
}
