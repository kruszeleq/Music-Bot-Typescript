import { Song } from "distube";

export interface ExtSong extends Song {
  skipped: boolean;
}
