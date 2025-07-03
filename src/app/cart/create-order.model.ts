import { AddressInputModel } from "./address-input.model";
import { CustomerInputModel } from "./customer-input.model";

export class CreateOrderModel {
    customer?: CustomerInputModel;
    address?: AddressInputModel;
}