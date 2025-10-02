import { BehaviorSubject, Observable } from 'rxjs';

export class State<T> {
    private state$: BehaviorSubject<T>;

    constructor(initialValues: T) {
        this.state$ = new BehaviorSubject(initialValues);
    }

    patch(partial: Partial<T>): void {
        this.update(s => ({ ...s, ...partial }));
    }

    update(updateFn: (current: T) => T): void {
        const currentState = this.state$.getValue();
        const newValue = updateFn(currentState);
        this.set(newValue);
    }

    set(newValue: T): void {
        this.state$.next({ ...newValue });
    }

    getSnapshot(): T {
        return { ...this.state$.getValue() };
    }

    stateChanges(): Observable<T> {
        return this.state$.asObservable();
    }
}
