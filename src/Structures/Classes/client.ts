import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import {
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
  Partials,
  version,
} from "discord.js";
import { DisTube } from "distube";
import mongoose from "mongoose";

import clientConfig from "../../config.js";
import ClientEventsHandler from "../Handlers/clientEvents.js";
import ComponentInteractionsHandler from "../Handlers/componentInteraction.js";
import SlashCommandHandler from "../Handlers/slashCommands.js";
import { Command } from "../Interfaces/Commands/command.js";
import { Config } from "../Interfaces/Config/config.js";
import { Event } from "../Interfaces/Events/event.js";
import { Button, SelectMenu } from "../Interfaces/index.js";
import ConsoleLogger from "./consoleLogger.js";

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const logger = new ConsoleLogger();

class DistubeClient extends Client<true> {
  distube = new DisTube(this, {
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
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

  public voiceGenerator: Collection<string, string>;

  public currentStatus: number;
  public config: Config;

  constructor() {
    super({
      intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
      partials: [User, Message, GuildMember, ThreadMember, Channel],
    });

    this.commands = new Collection();
    this.events = new Collection();

    this.selectMenus = new Collection();
    this.buttons = new Collection();

    this.voiceGenerator = new Collection();

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
