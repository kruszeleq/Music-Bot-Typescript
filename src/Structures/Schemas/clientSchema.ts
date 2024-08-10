import { Schema, model } from "mongoose";
export default model(
  "Client",
  new Schema({
    Client: Boolean,
    Memory: Array,
  })
);
