import { State } from './state';

describe('State', () => {
    beforeEach(() => {});

    it('should create state with default value', () => {
        const state = new State<OrderStateModel>({ orders: [] });
        const snapshot = state.getSnapshot();
        expect(snapshot.orders.length).toEqual(0);
        expect(snapshot.selectedOrder).not.toBeDefined();
    });

    it('should create state with value', () => {
        const orders: OrderModel[] = [
            { orderId: 1, description: 'order1' },
            { orderId: 2, description: 'order2' },
        ];
        const selectedOrder: OrderModel = { orderId: 1, description: 'order1'};
        const state = new State<OrderStateModel>({ orders, selectedOrder });
        const snapshot = state.getSnapshot();
        expect(snapshot.orders).toEqual(orders);
        expect(snapshot.selectedOrder).toEqual(selectedOrder);
    });
});

interface OrderStateModel {
    orders: OrderModel[];
    selectedOrder?: OrderModel;
}

interface OrderModel {
    orderId: number;
    description: string;
}
