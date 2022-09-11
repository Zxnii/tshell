import IPrompt from "./IPrompt";

const DefaultPrompt: IPrompt = {
    elements: [
        { text: "{{ CWD }}" },
        { text: "> " }
    ]
};

export default DefaultPrompt;