import process from "process";
import path from "path";
import fs from "fs";

export default class PathHandler {
    public getExecutable(name: string): string | undefined {
        const searchLocations = (process.env["PATH"] ??
            (process.platform === "win32" ? "C:\\Windows\\System32" + path.delimiter : "/" + path.delimiter))
            .split(path.delimiter)
            .filter(val => val.length > 0);

        const pathExt = process.platform === "win32" ? (process.env["PATHEXT"] ?? ".COM;.EXE").split(path.delimiter) : [];

        searchLocations.unshift(process.cwd());

        for (const searchLoc of searchLocations) {
            if (process.platform === "win32") {
                if (pathExt.includes(path.extname(name).toUpperCase())) {
                    const binaryPath = path.join(searchLoc, name);

                    if (fs.existsSync(binaryPath)) {
                        return binaryPath;
                    }

                    continue;
                }

                for (const ext of pathExt) {
                    const binaryPath = path.join(searchLoc, name + ext);

                    if (fs.existsSync(binaryPath)) {
                        return binaryPath;
                    }
                }
            } else {
                
            }
        }

        searchLocations.shift();

        return undefined;
    }
}