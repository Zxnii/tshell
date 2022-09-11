import Builtin from "./builtins/Builtin";
import PathHandler from "./PathHandler";
import Prompt from "./Prompt";
import process from "process";
import path from "path";
import fs from "fs";
import { ChildProcess, spawn } from "child_process";
import ConfigHandler from "./config/ConfigHandler";

export default class Shell {
    private static instance: Shell;

    private builtins: Map<string, Builtin> = new Map();
    private currentProc: ChildProcess | undefined;
    private pathHandler: PathHandler;
    private prompt: Prompt;

    private processRunning: boolean = false;

    constructor() {
        Shell.instance = this;

        ConfigHandler.loadConfig();
        ConfigHandler.saveConfig();

        this.loadBuiltins();
        this.pathHandler = new PathHandler();

        this.prompt = new Prompt();
        this.prompt.drawPrompt();
    }

    private loadBuiltins(): void {
        const dir = path.join(__dirname, "builtins");
        const builtins = fs.readdirSync(dir);

        for (const file of builtins) {
            if (!file.endsWith(".js")) {
                continue;
            }

            const className = path.basename(file, ".js");

            if (className === "Builtin") {
                continue;
            }

            const BuiltinCommand = <{new (): Builtin} & typeof Builtin>require(path.join(dir, className)).default;
            const command = new BuiltinCommand();

            this.builtins.set(BuiltinCommand.command, command);
        }
    }

    public executeCommand(raw: string): void {
        const argv = raw.split(" ");
        
        if (argv.length === 0 || argv[0].length === 0) {
            this.prompt.drawPrompt();
            return;
        }

        ConfigHandler.getConfig().history.push(raw);
        ConfigHandler.saveConfig();

        const command = argv[0];

        const builtin = this.builtins.get(command);

        if (typeof builtin === "object") {
            builtin.execute(argv);
            return;
        }

        const binaryLocation = this.pathHandler.getExecutable(command);

        if (typeof binaryLocation === "string") {
            this.executeBinary(binaryLocation, argv);
            return;
        }

        process.stdout.write("unknown command");
    }

    public executeBinary(binaryLocation: string, argv: string[]) {
        this.processRunning = true;

        this.currentProc = spawn(binaryLocation, argv.slice(1), {
            cwd: process.cwd(),
            shell: false,
            windowsHide: true,
            argv0: path.basename(argv[0]),
            stdio: "inherit",
            env: process.env
        });

        this.currentProc.once("exit", () => {
            this.processRunning = false;
            this.prompt.drawPrompt();
            this.currentProc = undefined;
        });

        this.currentProc.once("error", () => {
            this.processRunning = false;
            this.prompt.drawPrompt();
            this.currentProc = undefined;
        });
    }

    public terminateProcess(): void {
        if (typeof this.currentProc === "object") {
            this.currentProc.kill("SIGTERM");
            this.currentProc = undefined;
            this.processRunning = false;
            this.prompt.drawPrompt();
        }
    }

    public isProcessRunning(): boolean {
        return this.processRunning;
    }

    public static getInstance(): Shell {
        return Shell.instance;
    }
}

new Shell();