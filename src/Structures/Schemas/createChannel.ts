import { Schema, model } from "mongoose";
export default model(
  "CreateChannel",
  new Schema({
    GuildId: String,
    ChannelId: String,
  })
);
