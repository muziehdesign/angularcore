import { State } from './state';

describe('State', () => {
    beforeEach(() => {});

    it('should create state with default value', () => {
        const state = new State<TestStateModel>({ age: 1, colors: [], name: 'test', isActive: false });
        const streams: TestStateModel[] = [];
        state.stateChanges().subscribe((s) => streams.push(s));

        const snapshot = state.getSnapshot();
        expect(snapshot.age).toEqual(1);
        expect(snapshot.colors.length).toEqual(0);
        expect(snapshot.name).toEqual('test');
        expect(snapshot.isActive).toEqual(false);
        expect(snapshot.favoriteNumber).not.toBeDefined();
        expect(streams.length).toEqual(1);
        expect(streams[0]).toEqual(snapshot);
    });

    it('should patch state with partial value', () => {
        const state = new State<TestStateModel>({ age: 0, colors: [], name: '', isActive: false });
        const streams: TestStateModel[] = [];
        state.stateChanges().subscribe((s) => streams.push(s));

        state.patch({ age: 5 });
        const snapshot = state.getSnapshot();
        expect(snapshot.age).toEqual(5);
        expect(snapshot.colors.length).toEqual(0);
        expect(snapshot.name).toEqual('');
        expect(snapshot.isActive).toEqual(false);
        expect(snapshot.favoriteNumber).not.toBeDefined();
        expect(streams.length).toEqual(2);
        expect(streams[0]).toEqual({ age: 0, colors: [], name: '', isActive: false });
        expect(streams[1]).toEqual(snapshot);

        state.patch({ favoriteNumber: 42, colors: ['red', 'blue'] });
        const snapshot2 = state.getSnapshot();
        expect(snapshot2.age).toEqual(5);
        expect(snapshot2.colors).toEqual(['red', 'blue']);
        expect(snapshot2.name).toEqual('');
        expect(snapshot2.isActive).toEqual(false);
        expect(snapshot2.favoriteNumber).toEqual(42);

        expect(streams.length).toEqual(3);
        expect(streams[2]).toEqual(snapshot2);
    });

    it('should update state with update function', () => {
        const state = new State<TestStateModel>({ age: 0, colors: [], name: '', isActive: false });
        const streams: TestStateModel[] = [];
        state.stateChanges().subscribe((s) => streams.push(s));

        state.update((s) => ({ ...s, age: s.age + 10, isActive: !s.isActive }));
        const snapshot = state.getSnapshot();
        expect(snapshot.age).toEqual(10);
        expect(snapshot.colors.length).toEqual(0);
        expect(snapshot.name).toEqual('');
        expect(snapshot.isActive).toEqual(true);
        expect(snapshot.favoriteNumber).not.toBeDefined();
        expect(streams.length).toEqual(2);
        expect(streams[0]).toEqual({ age: 0, colors: [], name: '', isActive: false });
        expect(streams[1]).toEqual(snapshot);
    });

    it('should set state with new value', () => {
        const state = new State<TestStateModel>({ age: 0, colors: [], name: '', isActive: false });
        const streams: TestStateModel[] = [];
        state.stateChanges().subscribe((s) => streams.push(s));
        state.set({ age: 20, colors: ['green'], name: 'newName', isActive: true, favoriteNumber: 7 });
        const snapshot = state.getSnapshot();
        expect(snapshot.age).toEqual(20);
        expect(snapshot.colors).toEqual(['green']);
        expect(snapshot.name).toEqual('newName');
        expect(snapshot.isActive).toEqual(true);
        expect(snapshot.favoriteNumber).toEqual(7);
        expect(streams.length).toEqual(2);
        expect(streams[0]).toEqual({ age: 0, colors: [], name: '', isActive: false });
        expect(streams[1]).toEqual(snapshot);
    });
});

interface TestStateModel {
    age: number;
    colors: string[];
    name: string;
    isActive: boolean;
    favoriteNumber?: number;
}
