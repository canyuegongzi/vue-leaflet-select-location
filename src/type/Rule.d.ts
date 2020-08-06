export default class Rule {
    required: boolean;
    trigger: string;
    message: string;
    validator?: (rule: Rule, value: string, callback: (error?: Error) => void) => void;
    constructor({ required, trigger, message }: {
        required?: boolean;
        trigger?: string;
        message?: string;
    }, validator?: (rule: Rule, value: string, callback: (error?: Error) => void) => void);
}
