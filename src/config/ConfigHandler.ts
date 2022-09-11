import DefaultConfig from "./DefaultConfig";
import IConfig from "./IConfig";
import path from "path";
import os from "os";
import fs from "fs";
import Util from "../Util";
import IPrompt from "./IPrompt";
import DefaultPrompt from "./DefaultPrompt";

export default class ConfigHandler {
    private static config: IConfig = DefaultConfig;
    private static prompt: IPrompt = DefaultPrompt;
    private static configPath = path.join(os.homedir(), ".tshell.json");

    public static loadConfig(): void {
        const existing = Util.loadJson<IConfig>(this.configPath) ?? DefaultConfig;

        this.config = Util.mergeObjects<IConfig>(existing, DefaultConfig);
        this.prompt = Util.loadJson<IPrompt>(this.config.prompt) ?? DefaultPrompt;
    }

    public static saveConfig(): void {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config));
    }

    public static getConfig(): IConfig {
        return this.config;
    }

    public static getPrompt(): IPrompt {
        return this.prompt;   
    }
}