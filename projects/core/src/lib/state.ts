import { BehaviorSubject } from "rxjs";

export class State<T> {
    private state$: BehaviorSubject<T>;

    constructor(initialValues: T) {
        this.state$ = new BehaviorSubject(initialValues);
    }

    patch(partial: Partial<T>) {
        const newValue = Object.assign({}, this.state$.getValue(), partial);
        this.set(newValue);
    }

    set(newValue: T) {
        this.state$.next(structuredClone(newValue));
    }

    getSnapshot() {
        return structuredClone(this.state$.getValue());
    }

    stateChanges() {
        return this.state$.asObservable();
    }
}
