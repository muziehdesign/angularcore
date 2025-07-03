import { AfterViewInit, Component, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemModel } from '../models/cart-item.model';
import { RouterModule } from '@angular/router';
import { CustomerInputModel } from './customer-input.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateOrderModel } from './create-order.model';
import { AddressInputModel } from './address-input.model';
import { Router } from '@angular/router';
import { CartFacade } from './cart.facade';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-cart',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    providers: [CartFacade]
})
export class CartComponent implements AfterViewInit {
    items: Signal<CartItemModel[] | undefined>;
    model: CreateOrderModel;
    @ViewChild('cartForm', { static: true }) cartForm!: NgForm;
    constructor(private facade: CartFacade, private router: Router) {
        this.items = toSignal(this.facade.getItems());
        this.model = new CreateOrderModel();
        this.model.address = new AddressInputModel();
        this.model.customer = new CustomerInputModel();
    }

    ngAfterViewInit():void {
    }

    public async createOrder() {
        if(!(await this.facade.loginIfNeeded())) {
            return;
        }

        // TODO: troubleshoot needed for undefined form error
        await this.facade.createOrder(this.model);
        this.router.navigate(['/orders']);
    }

    public async removeItem(item: CartItemModel) {
        this.facade.removeItem(item.sku);
    }
}
