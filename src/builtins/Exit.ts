import Builtin from "./Builtin";

export default class Exit extends Builtin {
    public static command: string = "exit";

    public execute(argv: string[]): void {
        process.exit(0);
    }
}