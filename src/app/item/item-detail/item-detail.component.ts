import { Component, Signal, ViewChildren } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemModel } from '../models/item.model';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AddToCartModel } from '../models/add-to-cart.model';
import { ViewChild, AfterViewInit } from '@angular/core';
import { ItemFacade } from '../item.facade';

@Component({
    selector: 'app-item-detail',
    imports: [CommonModule, FormsModule],
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements AfterViewInit {
    item: Signal<ItemModel | undefined>;
    model: AddToCartModel;
    @ViewChild('cartForm', { static: false }) cartForm!: NgForm;
    constructor(
        private route: ActivatedRoute,
        private facade: ItemFacade
    ) {
        this.item = toSignal(facade.getItem(route.snapshot.params['sku']));
        //this.item = toSignal(facade.loadItem(route.snapshot.data));
        this.model = new AddToCartModel();
        this.model.quantity = 1;
    }

    ngAfterViewInit(): void {}

    public async addToCart() {
        // TODO: troubleshoot needed for undefined form error

        await this.facade.addItemToCart(this.item()!.sku, this.model.quantity!);
    }
}
