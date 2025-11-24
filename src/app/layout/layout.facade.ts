import { Inject, Injectable } from '@angular/core';
import { Authentication, AUTHENTICATION } from '@muziehdesign/angularcore';
import { map, Observable } from 'rxjs';
import { ShoppingCart } from '../core/shopping-cart';

@Injectable()
export class LayoutFacade {
    constructor(@Inject(AUTHENTICATION) private auth: Authentication, private cart: ShoppingCart) {}

    getUser() {
        return this.auth.stateChanges().pipe(map((s) => s.user));
    }

    login() {
        return this.auth.signinRedirect('/');
    }

    getCartCount(): Observable<number> {
        return this.cart.stateChanges().pipe(map((items) => items.length === 0 ? 0 : items.map((i) => i.quantity).reduce((a, b) => a + b)));
    }
}
