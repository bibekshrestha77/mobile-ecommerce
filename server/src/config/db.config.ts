import mongoose from "mongoose";

import {db_config} from "./config";

export const connect_DB = () => {
  console.log("Connecting to MongoDB:", db_config.db_uri, "/", db_config.db_name);
  mongoose
    .connect(db_config.db_uri, {
      dbName: db_config.db_name,
      autoCreate: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("------Database connection error-------");
      console.log(error);
    });
};
