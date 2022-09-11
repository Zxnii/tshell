import IConfig from "./IConfig"; 
import path from "path";
import os from "os";

const DefaultConfig: IConfig = {
    history: [],
    prompt: path.join(os.homedir(), ".tshell_default.json")
}

export default DefaultConfig;