export default interface IPrompt {
    elements: ({
        text: string;
        textColor?: string;
        backgroundColor?: string;
    } | {
        text: string;
        reset: boolean;
    } | {
        text: string;
    })[];
}