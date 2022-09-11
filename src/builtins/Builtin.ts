export default abstract class Builtin {
    public static command: string;

    public abstract execute(argv: string[]): void;
}