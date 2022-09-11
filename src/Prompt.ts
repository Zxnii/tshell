import process from "process";
import stripAnsi from "strip-ansi";
import ConfigHandler from "./config/ConfigHandler";
import Formatting from "./Formatting";
import Shell from "./Shell";
import Util from "./Util";
import os from "os";
import chalk from "chalk";

export default class Prompt {
    private currentInput = "";
    private promptEnd: number = 0;

    constructor() {
        process.stdin.setRawMode(true);
        process.stdin.on("data", this.onKey.bind(this));
    }

    public drawPrompt(): void {
        let unformatted = "";
        let formattingBlock = "";

        let lastTextColor: string | undefined;
        let lastBgColor: string | undefined;

        for (const element of ConfigHandler.getPrompt().elements) {
            if ("textColor" in element) {
                if (element.textColor !== lastTextColor) {
                    if (lastTextColor) formattingBlock = chalk.hex(lastTextColor)(formattingBlock);
                    if (lastBgColor) formattingBlock = chalk.bgHex(lastBgColor)(formattingBlock);

                    unformatted += formattingBlock;
                    formattingBlock = "";
                }

                lastTextColor = element.textColor;
            }

            if ("backgroundColor" in element) {
                if (element.backgroundColor !== lastBgColor) {
                    if (lastTextColor) formattingBlock = chalk.hex(lastTextColor)(formattingBlock);
                    if (lastBgColor) formattingBlock = chalk.bgHex(lastBgColor)(formattingBlock);

                    unformatted += formattingBlock;
                    formattingBlock = "";
                }

                lastBgColor = element.backgroundColor;
            }

            if ("reset" in element && element.reset) {
                if (lastTextColor) formattingBlock = chalk.hex(lastTextColor)(formattingBlock);
                if (lastBgColor) formattingBlock = chalk.bgHex(lastBgColor)(formattingBlock);

                unformatted += formattingBlock;
                formattingBlock = "";

                lastBgColor = undefined;
                lastTextColor = undefined;
            }

            formattingBlock += element.text;
        }

        if (lastTextColor) formattingBlock = chalk.hex(lastTextColor)(formattingBlock);
        if (lastBgColor) formattingBlock = chalk.bgHex(lastBgColor)(formattingBlock);

        unformatted += formattingBlock;
        formattingBlock = "";

        const formatted = Formatting.formatVariableString(unformatted, {
            cwd: Formatting.formatCwd(),
            name: os.userInfo().username
        });

        this.promptEnd = (stripAnsi(formatted).split("\n").pop() ?? "").length;

        process.stdout.write(formatted);
        process.stdout.write("\u001b[0m");
        process.stdout.cursorTo(this.promptEnd);
    }

    public drawText(): void {
        process.stdout.cursorTo(this.promptEnd);
        process.stdout.clearLine(1);
        process.stdout.write(this.currentInput);
    }

    public onKey(data: Buffer) {
        if (data[0] === 0x03) {
            process.stdout.write("^C");
        }

        Shell.getInstance().terminateProcess();

        if (Shell.getInstance().isProcessRunning()) {
            return;
        }

        if (data[0] == 0x08) {
            this.currentInput = this.currentInput.slice(0, this.currentInput.length-1);
        } else {
            if (data[0] >= 32 && data[0] != 127) {
                this.currentInput += data.toString();
            }

            if (data.toString() === "\r" || data.toString() === "\n") {
                process.stdout.write("\n");
                process.stdout.cursorTo(0);
                this.promptEnd = 0;
                Shell.getInstance().executeCommand(this.currentInput);
                this.currentInput = "";

                if (!Shell.getInstance().isProcessRunning()) {
                    process.stdout.write("\n");
                    this.drawPrompt();
                }
            }
        }

        this.drawText();
    }
}