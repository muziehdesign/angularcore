import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@muziehdesign/angularcore';
import { CheckoutComponent } from './checkout.component';

export const checkoutLazyLoadingRoutes: Routes = [
    {
        path: 'checkout',
        loadChildren: () => import('./checkout.module').then((m) => m.CheckoutModule),
        canMatch: [AuthenticationGuard],
    },
];

const routes: Routes = [{ path: '', component: CheckoutComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CheckoutRoutingModule {}
