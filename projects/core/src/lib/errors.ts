export class UnexpectedError extends Error {
    constructor(message: string, public readonly innerError?: unknown) {
        super(message);
        this.name = 'UnexpectedError';
    }
}