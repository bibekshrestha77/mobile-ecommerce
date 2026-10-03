"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect_DB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connect_DB = () => {
    console.log("Connecting to MongoDB:", config_1.db_config.db_uri, "/", config_1.db_config.db_name);
    mongoose_1.default
        .connect(config_1.db_config.db_uri, {
        dbName: config_1.db_config.db_name,
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
exports.connect_DB = connect_DB;
