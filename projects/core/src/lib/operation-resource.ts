import { computed, Signal, signal, WritableSignal } from '@angular/core';

export enum OperationStatus {
    Created = 0,
    Running = 1,
    Completed = 2,
}

export interface OperationResult<R> {
    data: R | undefined;
    error: unknown;
    status: OperationStatus;
}

export class OperationResource<R> {
    private result: WritableSignal<OperationResult<R>>;
    constructor() {
        this.result = signal<OperationResult<R>>({
            data: undefined,
            error: undefined,
            status: OperationStatus.Created,
        });
    }

    get status(): Signal<OperationStatus> {
        return computed(() => this.result().status);
    }

    get error(): Signal<unknown> {
        return computed(() => this.result().error);
    }

    get isRunning(): Signal<boolean> {
        return computed(() => this.result().status === OperationStatus.Running);
    }

    get isSuccessful(): Signal<boolean> {
        return computed(() => this.result().status === OperationStatus.Completed && this.result().error === undefined);
    }

    get isCompleted(): Signal<boolean> {
        return computed(() => this.result().status === OperationStatus.Completed);
    }

    setSuccess(value: R): void {
        this.result.set({
            data: value,
            error: undefined,
            status: OperationStatus.Completed,
        });
    }

    setError(error: unknown): void {
        this.result.set({
            data: undefined,
            error: error,
            status: OperationStatus.Completed,
        });
    }

    setLoading(): void {
        this.result.set({
            data: undefined,
            error: undefined,
            status: OperationStatus.Running,
        });
    }

    async setFromOperation(operation: () => Promise<R>): Promise<void> {
        this.setLoading();
        try {
            const result = await operation();
            this.setSuccess(result);
        } catch (error: unknown) {
            this.setError(error);
        }
    }
}
