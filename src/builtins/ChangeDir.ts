import Builtin from "./Builtin";
import path from "path";
import os from "os";

export default class ChangeDir extends Builtin {
    public static command: string = "cd";

    public execute(argv: string[]): void {
        if (argv.length != 2) {
            process.stderr.write(`usage: cd [path]`);
            return;
        }

        const pathArg = argv[1];
        const resolvedPath = path.resolve(process.cwd(), pathArg.replace("~", os.homedir()));

        process.chdir(resolvedPath);
    }
}