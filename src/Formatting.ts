import process from "process";
import os from "os";

export default class Formatting {
    public static formatCwd(): string {
        return process.cwd().replace(os.homedir(), "~");
    }

    public static formatVariableString(input: string, variables: {[key: string]: string}): string {
        const variableRegex = /\{\{(.*?)\}\}/g;
        const matches = input.matchAll(variableRegex);

        for (const match of matches) {
            const variable = match[1].trim();
            input = input.replace(match[0], variables[variable.toLowerCase()] ?? "");
        }

        return input;
    }
}