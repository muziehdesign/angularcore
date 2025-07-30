import { Component, OnInit, Signal } from '@angular/core';
import { AuthenticatedUser } from '@muziehdesign/angularcore';
import { Observable } from 'rxjs';
import { LayoutFacade } from '../layout.facade';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent{

    user: Signal<AuthenticatedUser | undefined>;
    itemCount$: Observable<number>;
    constructor(
        private facade: LayoutFacade
    ) {
        this.user = toSignal(this.facade.getUser());
        this.itemCount$ = this.facade.getCartCount();
    }

    async signIn() {
        await this.facade.login();
        return false;
    }

    async signOut() {
        await this.facade.logout();
    }

    async troubleshoot() {
        console.log(this.facade.getUser());
    }
}
