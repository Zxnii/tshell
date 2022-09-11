import fs from "fs";

export default class Util {
    public static mergeObjects<T extends { [key: string]: any }>(obj1: T, obj2: T): T {
        for (const [ key, value ] of Object.keys(obj2)) {
            if (typeof value === "object") {
                if (<object>value instanceof Array) {
                    if (!(key in obj1)) {
                        (<any>obj1)[key] = obj2[key];
                    }

                    continue;
                } else {
                    (<any>obj1)[key] = {};

                    this.mergeObjects(obj1[key], obj2[key]);

                    continue;
                }
            }

            if (!(key in obj1)) {
                (<any>obj1)[key] = obj2[key];
            }
        }

        return obj1;
    }

    public static loadJson<T>(path: string): T | undefined {
        if (!fs.existsSync(path)) {
            return undefined;
        }

        try {
            return JSON.parse(fs.readFileSync(path, "utf8"));
        } catch {
            return undefined;
        }
    }
}